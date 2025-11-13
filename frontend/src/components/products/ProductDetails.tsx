'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Product3DViewer from '@/components/product/Product3DViewer';
import { IProduct } from '@tangerine/shared';
import { getPlaceholderUrl } from '@/lib/imagekit';
import { cartService } from '@/lib/api/cart.service';
import { toast } from '@/lib/toast';

interface ProductDetailsProps {
    slug: string;
}

export default function ProductDetails({ slug }: ProductDetailsProps) {
    const router = useRouter();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showARViewer, setShowARViewer] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
                const response = await fetch(`${API_URL}/products/${slug}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setProduct(data.data);
                } else {
                    setProduct(null);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const handleAddToCart = async () => {
        if (!product) return;

        try {
            setIsAddingToCart(true);

            // Check if user is logged in
            const token = localStorage.getItem('token');

            // Get current cart from localStorage
            const cartStr = localStorage.getItem('cart');
            const cart = cartStr ? JSON.parse(cartStr) : { items: [] };

            // Check if product already in cart
            const existingItemIndex = cart.items.findIndex((item: any) => item.product === product._id);

            if (existingItemIndex >= 0) {
                // Update quantity
                cart.items[existingItemIndex].quantity += quantity;

                // If logged in, sync to backend
                if (token) {
                    await cartService.updateCartItem({
                        productId: product._id,
                        quantity: cart.items[existingItemIndex].quantity,
                    });
                }
            } else {
                // Add new item
                const newItem = {
                    product: product._id,
                    name: product.name,
                    slug: product.slug,
                    image: product.images?.[0]?.url || '',
                    price: product.salePrice || product.price,
                    quantity: quantity,
                    subtotal: (product.salePrice || product.price) * quantity,
                };

                cart.items.push(newItem);

                // If logged in, sync to backend
                if (token) {
                    await cartService.addToCart({
                        productId: product._id,
                        quantity: quantity,
                    });
                }
            }

            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));

            toast.success('Added to cart!');
        } catch (error: any) {
            console.error('Failed to add to cart:', error);
            toast.error('Failed to add to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!product) return;

        try {
            setIsAddingToCart(true);

            // Check if user is logged in
            const token = localStorage.getItem('token');

            // Get current cart from localStorage
            const cartStr = localStorage.getItem('cart');
            const cart = cartStr ? JSON.parse(cartStr) : { items: [] };

            // Check if product already in cart
            const existingItemIndex = cart.items.findIndex((item: any) => item.product === product._id);

            if (existingItemIndex >= 0) {
                // Update quantity
                cart.items[existingItemIndex].quantity += quantity;

                // If logged in, sync to backend
                if (token) {
                    await cartService.updateCartItem({
                        productId: product._id,
                        quantity: cart.items[existingItemIndex].quantity,
                    });
                }
            } else {
                // Add new item
                const newItem = {
                    product: product._id,
                    name: product.name,
                    slug: product.slug,
                    image: product.images?.[0]?.url || '',
                    price: product.salePrice || product.price,
                    quantity: quantity,
                    subtotal: (product.salePrice || product.price) * quantity,
                };

                cart.items.push(newItem);

                // If logged in, sync to backend
                if (token) {
                    await cartService.addToCart({
                        productId: product._id,
                        quantity: quantity,
                    });
                }
            }

            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));

            // Redirect to checkout
            router.push('/checkout');
        } catch (error: any) {
            console.error('Failed to buy now:', error);
            toast.error('Failed to proceed to checkout');
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-200 rounded-lg" />
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-12 bg-gray-200 rounded w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 text-center py-16">
                <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
                <p className="text-gray-600">The product you're looking for doesn't exist.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div>
                    {/* Main Image / 3D Viewer */}
                    <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
                        {showARViewer && product.model3D ? (
                            <Product3DViewer
                                glbUrl={product.model3D.glbUrl}
                                usdzUrl={product.model3D.usdzUrl}
                                alt={`${product.name} 3D model`}
                            />
                        ) : (
                            <motion.div
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={product.images[selectedImage]?.url || getPlaceholderUrl(800, 800)}
                                    alt={product.images[selectedImage]?.alt || product.name}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Thumbnail Images */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedImage(index);
                                    setShowARViewer(false);
                                }}
                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index && !showARViewer
                                    ? 'border-primary'
                                    : 'border-transparent hover:border-gray-300'
                                    }`}
                            >
                                <Image
                                    src={image.thumbnail || image.url}
                                    alt={image.alt}
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                        {product.model3D && (
                            <button
                                onClick={() => setShowARViewer(!showARViewer)}
                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-50 ${showARViewer ? 'border-primary' : 'border-transparent hover:border-gray-300'
                                    }`}
                            >
                                <span className="text-2xl">🔲</span>
                            </button>
                        )}
                    </div>

                    {/* AR Button */}
                    {product.model3D && (
                        <button className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            View in Your Room (AR)
                        </button>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">
                            {product.rating} ({product.reviewCount} reviews)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        {product.salePrice ? (
                            <div className="flex items-center gap-3">
                                <span className="text-4xl font-bold text-primary">
                                    KES {product.salePrice.toLocaleString()}
                                </span>
                                <span className="text-2xl text-gray-500 line-through">
                                    KES {product.price.toLocaleString()}
                                </span>
                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                                    Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                                </span>
                            </div>
                        ) : (
                            <span className="text-4xl font-bold text-primary">
                                KES {product.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Options:</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant.id)}
                                        className={`px-4 py-2 border rounded-lg transition-all ${selectedVariant === variant.id
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-300 hover:border-primary'
                                            }`}
                                    >
                                        {variant.value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Quantity:</h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 border border-gray-300 rounded-lg hover:border-primary transition-colors flex items-center justify-center"
                            >
                                -
                            </button>
                            <span className="w-16 text-center font-semibold">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 border border-gray-300 rounded-lg hover:border-primary transition-colors flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-6">
                        {product.inStock ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">In Stock ({product.stockQuantity} available)</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Out of Stock</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock || isAddingToCart}
                            className="flex-1 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAddingToCart ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>Adding...</span>
                                </>
                            ) : (
                                'Add to Cart'
                            )}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={!product.inStock || isAddingToCart}
                            className="flex-1 px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Product Details */}
                    <div className="border-t pt-6 space-y-4">
                        <h3 className="font-semibold text-lg">Product Details</h3>

                        {/* Specifications */}
                        <div className="space-y-2">
                            {product.specifications.map((spec, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{spec.label}:</span>
                                    <span className="font-medium">{spec.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Dimensions */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Dimensions:</span>
                            <span className="font-medium">
                                {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Weight:</span>
                            <span className="font-medium">{product.dimensions.weight} {product.dimensions.weightUnit}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">SKU:</span>
                            <span className="font-medium">{product.sku}</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="border-t mt-6 pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm">Free Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm">30-Day Returns</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm">Warranty Included</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm">Assembly Service</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

