'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { IProduct } from '@tangerine/shared';

export default function ProductsGrid() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('-createdAt');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

                // Build query parameters from URL
                const params = new URLSearchParams();

                // Get all filter params from URL
                const category = searchParams.get('category');
                const materials = searchParams.get('materials');
                const colors = searchParams.get('colors');
                const minPrice = searchParams.get('minPrice');
                const maxPrice = searchParams.get('maxPrice');
                const inStock = searchParams.get('inStock');
                const onSale = searchParams.get('onSale');

                if (category) params.append('category', category);
                if (materials) params.append('materials', materials);
                if (colors) params.append('colors', colors);
                if (minPrice) params.append('minPrice', minPrice);
                if (maxPrice) params.append('maxPrice', maxPrice);
                if (inStock) params.append('inStock', inStock);
                if (onSale) params.append('onSale', onSale);
                params.append('sort', sortBy);

                console.log('Fetching products with params:', params.toString());

                const response = await fetch(`${apiUrl}/products?${params.toString()}`);

                if (!response.ok) {
                    console.error('API error:', response.status, response.statusText);
                    setProducts([]);
                    return;
                }

                const data = await response.json();
                console.log('Products API Response:', {
                    success: data.success,
                    count: data.count,
                    total: data.total,
                    productsReceived: data.data?.length
                });

                if (data.success) {
                    setProducts(data.data || []);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams, sortBy]);

    if (loading) {
        return (
            <div>
                {/* Sort Header */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">Loading products...</p>
                </div>

                {/* Loading Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Sort Header */}
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                    {products.length} {products.length === 1 ? 'product' : 'products'} found
                </p>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                    <option value="-createdAt">Newest</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                    <option value="-rating">Most Popular</option>
                </select>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🛋️</div>
                    <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">
                        Try adjusting your filters or check back later for new arrivals.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}

            {/* Pagination - TODO */}
            {products.length > 0 && (
                <div className="mt-12 flex justify-center">
                    <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            2
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            3
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

