import { Metadata } from 'next';
import CartContent from '@/components/cart/CartContent';

export const metadata: Metadata = {
    title: 'Shopping Cart',
    description: 'Review your cart and proceed to checkout.',
};

export default function CartPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
                <CartContent />
            </div>
        </main>
    );
}

