'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPlaceholderUrl } from '@/lib/imagekit';
import { toast, cartToast } from '@/lib/toast';
import { useConfirm } from '@/lib/hooks/useConfirm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { cartService } from '@/lib/api/cart.service';

interface LocalCartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    slug?: string;
}

export default function CartContent() {
    const { confirm, confirmState, handleConfirm, handleCancel, handleOpenChange } = useConfirm();
    const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        const loadCart = () => {
            try {
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                console.log('Cart loaded:', cart);
                setCartItems(cart);
            } catch (error) {
                console.error('Error loading cart:', error);
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        loadCart();

        // Listen for cart updates
        const handleCartUpdate = () => {
            console.log('Cart update event received');
            loadCart();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('storage', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('storage', handleCartUpdate);
        };
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50000 ? 0 : 1500; // Free shipping over KES 50,000
    const tax = subtotal * 0.16; // 16% VAT
    const total = subtotal + shipping + tax;

    const updateQuantity = async (productId: string, newQuantity: number) => {
        setIsUpdating(true);
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        if (newQuantity <= 0) {
            // Remove item
            removeItem(productId);
            return;
        }

        const itemIndex = cart.findIndex((item: LocalCartItem) => item.productId === productId);
        if (itemIndex >= 0) {
            const itemName = cart[itemIndex].name;
            cart[itemIndex].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            setCartItems(cart);
            window.dispatchEvent(new Event('cartUpdated'));

            // Sync to backend if logged in
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await cartService.updateCartItem({
                        productId: productId,
                        quantity: newQuantity,
                    });
                } catch (error) {
                    console.error('Failed to sync cart update to backend:', error);
                }
            }

            // Show toast notification
            cartToast.updated(itemName, newQuantity);
        }

        setTimeout(() => setIsUpdating(false), 300);
    };

    const removeItem = async (productId: string) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cart.find((item: LocalCartItem) => item.productId === productId);

        if (!item) return;

        // Show confirmation dialog
        const confirmed = await confirm({
            title: 'Remove Item',
            description: `Are you sure you want to remove "${item.name}" from your cart?`,
            confirmLabel: 'Remove',
            cancelLabel: 'Cancel',
            variant: 'warning',
        });

        if (!confirmed) return;

        setIsUpdating(true);
        const updatedCart = cart.filter((item: LocalCartItem) => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));

        // Sync to backend if logged in
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await cartService.removeFromCart(productId);
            } catch (error) {
                console.error('Failed to sync cart removal to backend:', error);
            }
        }

        // Show toast notification
        cartToast.removed(item.name);

        setTimeout(() => setIsUpdating(false), 300);
    };

    const applyCoupon = () => {
        if (!couponCode.trim()) {
            toast.warning('Enter Coupon', 'Please enter a coupon code to apply.');
            return;
        }

        // TODO: Apply coupon via API
        toast.info('Feature Coming Soon', 'Coupon functionality will be available soon!');
        console.log('Apply coupon:', couponCode);
    };

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="text-4xl mb-4">Loading...</div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link
                    href="/products"
                    className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                    <div
                        key={item.productId}
                        className="bg-white rounded-lg shadow-sm p-6 flex flex-col sm:flex-row gap-4"
                    >
                        {/* Product Image */}
                        <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                                src={item.image || getPlaceholderUrl(300, 300)}
                                alt={item.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 128px"
                                className="object-cover"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                            <Link
                                href={`/products/${item.slug || '#'}`}
                                className="text-lg font-semibold hover:text-primary transition-colors"
                            >
                                {item.name}
                            </Link>
                            <p className="text-lg font-bold text-primary mt-2">
                                KES {item.price.toLocaleString()} each
                            </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                    disabled={isUpdating}
                                    className="w-10 h-10 border border-gray-300 rounded hover:border-primary hover:bg-primary hover:text-white transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-bold text-lg">
                                    {isUpdating ? '...' : item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                    disabled={isUpdating}
                                    className="w-10 h-10 border border-gray-300 rounded hover:border-primary hover:bg-primary hover:text-white transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    +
                                </button>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-600">Subtotal</p>
                                <p className="text-xl font-bold text-primary">
                                    KES {(item.price * item.quantity).toLocaleString()}
                                </p>
                            </div>

                            <button
                                onClick={() => removeItem(item.productId)}
                                disabled={isUpdating}
                                className="text-sm text-red-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                    {/* Coupon Code */}
                    <div className="mb-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            />
                            <button
                                onClick={applyCoupon}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>KES {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax (16%)</span>
                            <span>KES {tax.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-3">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">KES {total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <Link
                        href="/checkout"
                        className="block w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-center mb-3"
                    >
                        Proceed to Checkout
                    </Link>

                    <Link
                        href="/products"
                        className="block w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                    >
                        Continue Shopping
                    </Link>

                    {/* Free Shipping Info */}
                    {shipping > 0 && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg text-sm text-center">
                            Add <strong>KES {(50000 - subtotal).toLocaleString()}</strong> more for free shipping!
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={confirmState.open}
                onOpenChange={handleOpenChange}
                title={confirmState.title}
                description={confirmState.description}
                confirmLabel={confirmState.confirmLabel}
                cancelLabel={confirmState.cancelLabel}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                variant={confirmState.variant}
            />
        </div>
    );
}

