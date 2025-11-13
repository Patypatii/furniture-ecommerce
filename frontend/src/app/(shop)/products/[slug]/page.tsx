import { Metadata } from 'next';
import ProductDetails from '@/components/products/ProductDetails';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductReviews from '@/components/products/ProductReviews';

export const metadata: Metadata = {
    title: 'Product Details',
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <ProductDetails slug={params.slug} />

            {/* Reviews Section */}
            <section className="container mx-auto px-4 py-16">
                <ProductReviews productId="" />
            </section>

            {/* Related Products */}
            <section className="container mx-auto px-4 py-16 bg-gray-50">
                <RelatedProducts />
            </section>
        </main>
    );
}

