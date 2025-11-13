'use client';

import ProductCard from './ProductCard';

export default function RelatedProducts() {
    // TODO: Fetch related products from API
    const products = [];

    if (products.length === 0) {
        return null;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}

