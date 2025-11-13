import { Metadata } from 'next';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your purchase securely.',
};

export default function CheckoutPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                <CheckoutForm />
            </div>
        </main>
    );
}

