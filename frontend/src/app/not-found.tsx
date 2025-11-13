import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 - Page Not Found | Tangerine Furniture',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 to-white flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
                    <div className="text-6xl mb-6">🛋️</div>
                </div>

                {/* Content */}
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                    Looks like this furniture piece got moved to a different showroom!
                    The page you're looking for doesn't exist.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-lg"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/products"
                        className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold text-lg"
                    >
                        Browse Products
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-600 mb-4">Quick Links:</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/category/living-room" className="text-primary hover:underline">
                            Living Room
                        </Link>
                        <Link href="/products?category=sofas" className="text-primary hover:underline">
                            Sofas
                        </Link>
                        <Link href="/products?category=beds" className="text-primary hover:underline">
                            Beds
                        </Link>
                        <Link href="/products?category=dining-sets" className="text-primary hover:underline">
                            Dining Sets
                        </Link>
                        <Link href="/contact-us" className="text-primary hover:underline">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

