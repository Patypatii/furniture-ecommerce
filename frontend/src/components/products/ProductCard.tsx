'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { IProduct } from '@tangerine/shared';
import { getPlaceholderUrl } from '@/lib/imagekit';
import { toast, cartToast, authToast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { cartService } from '@/lib/api/cart.service';

interface ProductCardProps {
    product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        // Check if product is in cart
        const checkCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const cartItem = cart.find((item: any) => item.productId === product._id);

            if (cartItem) {
                setIsInCart(true);
                setCartQuantity(cartItem.quantity || 1);
            } else {
                setIsInCart(false);
                setCartQuantity(0);
            }
        };

        checkAuth();
        checkCart();

        // Listen for cart updates
        window.addEventListener('storage', checkCart);
        window.addEventListener('cartUpdated', checkCart);

        return () => {
            window.removeEventListener('storage', checkCart);
            window.removeEventListener('cartUpdated', checkCart);
        };
    }, [product._id]);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            // Show toast notification for login requirement
            authToast.loginRequired('Please log in to save items to your wishlist');
            // Redirect after a brief delay
            setTimeout(() => {
                router.push('/login?redirect=/products');
            }, 1000);
            return;
        }

        const newWishlistState = !isWishlisted;
        setIsWishlisted(newWishlistState);

        // Show appropriate toast message
        if (newWishlistState) {
            toast.success('Added to wishlist', `${product.name} has been added to your wishlist.`);
        } else {
            toast.info('Removed from wishlist', `${product.name} has been removed from your wishlist.`);
        }

        // TODO: API call to update wishlist
        console.log(newWishlistState ? 'Added to wishlist' : 'Removed from wishlist');
    };

    const updateCart = async (newQuantity: number) => {
        setIsUpdating(true);
        console.log('updateCart called:', product.name, 'New quantity:', newQuantity);

        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const isLoggedIn = !!localStorage.getItem('token');

            if (newQuantity <= 0) {
                // Remove from cart
                const updatedCart = cart.filter((item: any) => item.productId !== product._id);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                setIsInCart(false);
                setCartQuantity(0);
                console.log('Removed from cart, new cart:', updatedCart);

                // Sync to backend if logged in
                if (isLoggedIn) {
                    try {
                        await cartService.removeFromCart(product._id);
                    } catch (error) {
                        console.error('Failed to sync removal to backend:', error);
                    }
                }

                // Show toast notification
                cartToast.removed(product.name);
            } else {
                // Update or add to cart
                const existingIndex = cart.findIndex((item: any) => item.productId === product._id);
                const isNewItem = existingIndex < 0;

                if (existingIndex >= 0) {
                    // Update existing item
                    cart[existingIndex].quantity = newQuantity;
                    console.log('Updated existing item');
                } else {
                    // Add new item
                    cart.push({
                        productId: product._id,
                        name: product.name,
                        price: product.salePrice || product.price,
                        image: product.images[0]?.url,
                        quantity: newQuantity,
                    });
                    console.log('Added new item to cart');
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                setIsInCart(true);
                setCartQuantity(newQuantity);
                console.log('Cart saved:', cart);

                // Sync to backend if logged in
                if (isLoggedIn) {
                    try {
                        if (isNewItem) {
                            await cartService.addToCart({
                                productId: product._id,
                                quantity: newQuantity,
                            });
                        } else {
                            await cartService.updateCartItem({
                                productId: product._id,
                                quantity: newQuantity,
                            });
                        }
                        console.log('✅ Cart synced to backend');
                    } catch (error) {
                        console.error('Failed to sync cart to backend:', error);
                    }
                }

                // Show appropriate toast notification
                if (isNewItem) {
                    cartToast.added(product.name);
                } else {
                    cartToast.updated(product.name, newQuantity);
                }
            }

            // Trigger cart update event
            console.log('Firing cartUpdated event');
            const event = new CustomEvent('cartUpdated', { detail: { productId: product._id, quantity: newQuantity } });
            window.dispatchEvent(event);
        } catch (error) {
            console.error('Error updating cart:', error);
            cartToast.error('Failed to update cart. Please try again.');
        } finally {
            // Reset loading state
            setTimeout(() => setIsUpdating(false), 300);
        }
    };

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateCart(1);
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateCart(cartQuantity + 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateCart(cartQuantity - 1);
    };

    return (
        <motion.div
            className="group relative"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                        src={product.images[0]?.url || getPlaceholderUrl(600, 600)}
                        alt={product.images[0]?.alt || product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.salePrice && (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Sale
                            </span>
                        )}
                        {product.featured && (
                            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Featured
                            </span>
                        )}
                        {!product.inStock && (
                            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white"
                        aria-label="Add to wishlist"
                    >
                        <svg
                            className="w-5 h-5"
                            fill={isWishlisted ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>

                    {/* Cart Controls - Show when in cart OR on hover */}
                    {product.inStock && (
                        <AnimatePresence>
                            {(isInCart || undefined) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-lg overflow-hidden"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <button
                                        onClick={handleDecrement}
                                        disabled={isUpdating}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-semibold text-gray-900">
                                        {isUpdating ? '...' : cartQuantity}
                                    </span>
                                    <button
                                        onClick={handleIncrement}
                                        disabled={isUpdating}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}

                    {/* Quick Add Button - Show on hover when NOT in cart */}
                    {product.inStock && !isInCart && (
                        <button
                            onClick={handleQuickAdd}
                            disabled={isUpdating}
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-white text-gray-900 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? 'Adding...' : 'Quick Add'}
                        </button>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.reviewCount})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        {product.salePrice ? (
                            <>
                                <span className="text-xl font-bold text-primary">
                                    KES {product.salePrice.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    KES {product.price.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-primary">
                                KES {product.price.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

