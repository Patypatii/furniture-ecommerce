import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsGrid from '@/components/products/ProductsGrid';
import ProductFilters from '@/components/products/ProductFilters';

export const metadata: Metadata = {
    title: 'Products',
    description: 'Browse our collection of premium furniture. Filter by category, price, and more.',
};

export default function ProductsPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Our Products</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Discover our curated collection of premium furniture pieces designed to transform your living space.
                    </p>
                </div>

                {/* Products Layout */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <Suspense fallback={<div className="text-gray-500">Loading filters...</div>}>
                            <ProductFilters />
                        </Suspense>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <Suspense fallback={<div className="text-gray-500">Loading products...</div>}>
                            <ProductsGrid />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}

