import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsGrid from '@/components/products/ProductsGrid';

export const metadata: Metadata = {
    title: 'Shop | Tangerine Furniture',
    description: 'Browse our complete collection of quality furniture in Nairobi, Kenya',
};

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop All Products</h1>
                    <p className="text-lg text-gray-600">
                        Explore our complete collection of quality furniture for your home and business
                    </p>
                </div>
                <Suspense fallback={<div className="text-gray-500">Loading products...</div>}>
                    <ProductsGrid />
                </Suspense>
            </div>
        </div>
    );
}

