'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IAddress, PaymentMethod, ICart, ICreateOrderData, ICartItem } from '@tangerine/shared';
import AddressManager from '@/components/account/AddressManager';
import { toast } from '@/lib/toast';
import { cartService } from '@/lib/api/cart.service';
import { orderService } from '@/lib/api/order.service';
import { useRouter } from 'next/navigation';
import { validateAndCleanCart } from '@/lib/utils/validate-cart';
import { userService } from '@/lib/api/user.service';

export default function CheckoutForm() {
    const router = useRouter();
    const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
    const [showAddressManager, setShowAddressManager] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cart, setCart] = useState<ICart | null>(null);
    const [isLoadingCart, setIsLoadingCart] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Fetch cart data
    useEffect(() => {
        const fetchCart = async () => {
            try {
                setIsLoadingCart(true);

                // Check if user is logged in
                const token = localStorage.getItem('token');

                if (token) {
                    // For logged-in users: ONLY use backend database cart
                    console.log('🔒 Logged-in user - fetching cart from database only');

                    try {
                        const cartData = await cartService.getCart();
                        console.log('📦 Backend cart:', cartData);

                        if (cartData && cartData.items && cartData.items.length > 0) {
                            setCart(cartData);
                        } else {
                            console.log('⚠️ Backend cart is empty');
                            setCart(null);
                        }
                    } catch (apiError: any) {
                        console.error('Failed to fetch backend cart:', apiError);
                        setCart(null);
                    }
                } else {
                    // For guest users: Use localStorage
                    console.log('👤 Guest user - using localStorage cart');

                    await validateAndCleanCart();

                    const localCart = localStorage.getItem('cart');
                    if (localCart) {
                        const cartItems = JSON.parse(localCart);
                        console.log('📦 Raw cart from localStorage:', cartItems);

                        if (cartItems && cartItems.length > 0) {
                            // Remove duplicates by productId
                            const uniqueItems = cartItems.reduce((acc: any[], item: any) => {
                                const existingIndex = acc.findIndex(i => i.productId === item.productId);
                                if (existingIndex >= 0) {
                                    // Merge quantities for duplicates
                                    acc[existingIndex].quantity += item.quantity;
                                } else {
                                    acc.push({ ...item });
                                }
                                return acc;
                            }, []);

                            console.log('🧹 Deduplicated cart:', uniqueItems);

                            // Calculate totals
                            const subtotal = uniqueItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
                            const taxRate = 0.16; // 16% VAT
                            const tax = subtotal * taxRate;
                            const shipping = subtotal > 10000 ? 0 : 500; // Free shipping over 10,000 KES
                            const total = subtotal + tax + shipping;

                            // Create cart object
                            const localCartData: ICart = {
                                _id: 'local-cart',
                                items: uniqueItems.map((item: any) => ({
                                    product: item.productId || item.id,
                                    name: item.name,
                                    image: item.image,
                                    price: item.price,
                                    quantity: item.quantity,
                                    subtotal: item.price * item.quantity,
                                })),
                                subtotal: Math.round(subtotal * 100) / 100,
                                tax: Math.round(tax * 100) / 100,
                                shipping: Math.round(shipping * 100) / 100,
                                discount: 0,
                                total: Math.round(total * 100) / 100,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            };

                            // Save deduplicated cart back to localStorage
                            localStorage.setItem('cart', JSON.stringify(uniqueItems));
                            window.dispatchEvent(new Event('cartUpdated'));

                            setCart(localCartData);
                            return;
                        }
                    }

                    // No cart found
                    setCart(null);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
                toast.error('Failed to load cart');
            } finally {
                setIsLoadingCart(false);
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        const initializeCheckout = async () => {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            const loggedIn = !!token;
            setIsLoggedIn(loggedIn);

            // Redirect to login if not authenticated
            if (!loggedIn) {
                toast.error('Please login to continue with checkout');
                router.push('/login?redirect=/checkout');
                return;
            }

            // Fetch user profile from API to get addresses
            try {
                const user = await userService.getProfile();
                // Auto-select default address
                const defaultAddr = user.addresses?.find((a: IAddress) => a.isDefault);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr);
                    setShowAddressManager(false);
                }
            } catch (error) {
                console.error('Failed to load user profile:', error);
            }
        };

        initializeCheckout();
    }, [router]);

    const handleAddressSelect = (address: IAddress) => {
        setSelectedAddress(address);
        setShowAddressManager(false);
        toast.success('Address selected');
    };

    const handlePlaceOrder = async () => {
        try {
            // Validate
            if (!selectedAddress) {
                toast.error('Please select a shipping address');
                setStep('shipping');
                return;
            }

            if (!cart || cart.items.length === 0) {
                toast.error('Your cart is empty');
                return;
            }

            if (!isLoggedIn) {
                toast.error('Please login to place an order');
                router.push('/login?redirect=/checkout');
                return;
            }

            setIsProcessing(true);

            console.log('🛒 Placing order with cart:', cart);

            // Prepare order data with items (backend will sync to DB if needed)
            const items: ICartItem[] = cart.items.map((item) => ({
                product: item.product,
                name: item.name,
                slug: item.slug || item.product,
                image: item.image || '/placeholder.jpg',
                price: item.price,
                quantity: item.quantity,
                subtotal: item.subtotal ?? item.price * item.quantity,
                variant: item.variant,
            }));

            const orderData: ICreateOrderData = {
                items,
                shipping: selectedAddress,
                billing: selectedAddress, // Same as shipping for now
                paymentMethod: paymentMethod,
                notes: '', // Optional notes
            };

            console.log('📦 Order data being sent:', orderData);
            console.log('🔒 Backend will use database cart or sync from request if needed');

            // Create order via API
            const order = await orderService.createOrder(orderData);

            console.log('✅ Order created:', order);

            // Backend already cleared the cart, just clear localStorage
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));
            console.log('🗑️ Cart cleared from localStorage');

            // Show success message
            toast.success('🎉 Order placed successfully! Track your order in the Orders section.');

            // Play success notification sound
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.1;

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
            } catch (e) {
                // Ignore audio errors
            }

            // Redirect to order confirmation page
            router.push(`/account/orders/${order._id}`);

        } catch (error: any) {
            console.error('❌ Order placement error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });

            const errorMessage = error.response?.data?.error || error.message || 'Failed to place order. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const onSubmit = async (data: any) => {
        // Legacy form submission handler
        await handlePlaceOrder();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Steps */}
            <div className="lg:col-span-2">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    {['Shipping', 'Payment', 'Review'].map((label, index) => {
                        const stepValue = ['shipping', 'payment', 'review'][index];
                        const isActive = step === stepValue;
                        const isCompleted = ['shipping', 'payment', 'review'].indexOf(step) > index;

                        return (
                            <div key={label} className="flex items-center flex-1">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${isActive || isCompleted
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {isCompleted ? '✓' : index + 1}
                                </div>
                                <span
                                    className={`ml-2 font-medium ${isActive ? 'text-primary' : 'text-gray-600'
                                        }`}
                                >
                                    {label}
                                </span>
                                {index < 2 && (
                                    <div
                                        className={`flex-1 h-1 mx-4 ${isCompleted ? 'bg-primary' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-6">
                    {/* Shipping Address Selection */}
                    {step === 'shipping' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

                            {/* Selected Address Display */}
                            {selectedAddress && !showAddressManager && (
                                <div className="mb-4 p-4 bg-primary/5 border-2 border-primary rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-lg mb-2">{selectedAddress.fullName}</p>
                                            <p className="text-sm text-gray-700">{selectedAddress.phone}</p>
                                            <p className="text-sm text-gray-700 mt-2">
                                                {selectedAddress.addressLine1}
                                                {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowAddressManager(true)}
                                            className="text-primary hover:underline text-sm font-medium"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Address Manager */}
                            {showAddressManager && (
                                <AddressManager
                                    selectionMode
                                    onSelectAddress={handleAddressSelect}
                                />
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    if (!selectedAddress) {
                                        toast.warning('Please select a shipping address');
                                        return;
                                    }
                                    setStep('payment');
                                }}
                                className="mt-6 w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                            >
                                Continue to Payment
                            </button>
                        </div>
                    )}

                    {/* Payment Method */}
                    {step === 'payment' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                            <div className="space-y-4">
                                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="mpesa"
                                        checked={paymentMethod === 'mpesa'}
                                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <div className="ml-4 flex-1">
                                        <div className="font-medium">M-Pesa</div>
                                        <div className="text-sm text-gray-600">Pay securely with M-Pesa</div>
                                    </div>
                                    <span className="text-2xl">📱</span>
                                </label>

                                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <div className="ml-4 flex-1">
                                        <div className="font-medium">Credit/Debit Card</div>
                                        <div className="text-sm text-gray-600">Visa, Mastercard accepted</div>
                                    </div>
                                    <span className="text-2xl">💳</span>
                                </label>

                                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash_on_delivery"
                                        checked={paymentMethod === 'cash_on_delivery'}
                                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <div className="ml-4 flex-1">
                                        <div className="font-medium">Cash on Delivery</div>
                                        <div className="text-sm text-gray-600">Pay when you receive your order</div>
                                    </div>
                                    <span className="text-2xl">💵</span>
                                </label>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep('shipping')}
                                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep('review')}
                                    className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                                >
                                    Review Order
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Order Review */}
                    {step === 'review' && (
                        <div className="space-y-4">
                            {/* Shipping Details */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                                    <button
                                        type="button"
                                        onClick={() => setStep('shipping')}
                                        className="text-primary hover:underline text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                </div>
                                {selectedAddress && (
                                    <div>
                                        <p className="font-medium">{selectedAddress.fullName}</p>
                                        <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                                        <p className="text-sm text-gray-700 mt-2">
                                            {selectedAddress.addressLine1}
                                            {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                                        </p>
                                        <p className="text-sm text-gray-700">{selectedAddress.country}</p>
                                    </div>
                                )}
                            </div>

                            {/* Payment Details */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Payment Method</h3>
                                    <button
                                        type="button"
                                        onClick={() => setStep('payment')}
                                        className="text-primary hover:underline text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {paymentMethod === 'mpesa' ? '📱' : paymentMethod === 'card' ? '💳' : '💵'}
                                    </span>
                                    <div>
                                        <p className="font-medium capitalize">
                                            {paymentMethod === 'mpesa' ? 'M-Pesa' :
                                                paymentMethod === 'card' ? 'Credit/Debit Card' :
                                                    'Cash on Delivery'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {paymentMethod === 'mpesa' ? 'Mobile money payment' :
                                                paymentMethod === 'card' ? 'Card payment' :
                                                    'Pay when you receive'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep('payment')}
                                        className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing || !cart || cart.items.length === 0}
                                        className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessing && (
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {isProcessing ? 'Processing Order...' : 'Place Order'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                    {isLoadingCart ? (
                        <div className="text-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-sm text-gray-600 mt-2">Loading cart...</p>
                        </div>
                    ) : cart && cart.items.length > 0 ? (
                        <>
                            {/* Cart Items */}
                            <div className="mb-4 space-y-3 max-h-60 overflow-y-auto">
                                {cart.items.map((item, index) => (
                                    <div key={index} className="flex gap-3 pb-3 border-b border-gray-200">
                                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold text-primary mt-1">
                                                KES {(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 mb-4 pt-4 border-t">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">KES {cart.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {cart.shipping === 0 ? 'FREE' : `KES ${cart.shipping.toLocaleString()}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (16%)</span>
                                    <span className="font-medium">KES {cart.tax.toLocaleString()}</span>
                                </div>
                                {cart.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-medium">-KES {cart.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">KES {cart.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Your cart is empty</p>
                            <a
                                href="/shop"
                                className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition text-sm font-medium"
                            >
                                Continue Shopping
                            </a>
                        </div>
                    )}

                    {cart && cart.items.length > 0 && (
                        <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>30-Day Returns</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Free Delivery (orders over KES 10,000)</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

