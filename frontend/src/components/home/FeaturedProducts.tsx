'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { IProduct } from '@tangerine/shared';
import { getPlaceholderUrl } from '@/lib/imagekit';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
                const response = await fetch(`${apiUrl}/products/featured`);

                if (!response.ok) {
                    console.error('Featured products API error:', response.status);
                    setProducts([]);
                    return;
                }

                const data = await response.json();
                console.log('Featured products:', data);

                if (data.success && data.data) {
                    setProducts(data.data.slice(0, 4)); // Show max 4 on homepage
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching featured products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 h-80 rounded-lg mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <ScrollReveal>
                <h2 className="text-4xl font-bold text-center mb-4">Featured Products</h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Discover our handpicked selection of premium furniture pieces
                </p>
            </ScrollReveal>

            {products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No featured products available at the moment.</p>
                    <Link
                        href="/products"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Browse All Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <ScrollReveal key={product._id} delay={index * 0.1}>
                            <Link href={`/products/${product.slug}`}>
                                <motion.div
                                    className="group cursor-pointer"
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                                        <Image
                                            src={product.images[0]?.url || getPlaceholderUrl(600, 600)}
                                            alt={product.images[0]?.alt || product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {product.salePrice && (
                                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                Sale
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
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
                                </motion.div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            )}
        </div>
    );
}

