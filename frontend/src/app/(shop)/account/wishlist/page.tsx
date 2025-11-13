import Link from 'next/link';

export default function WishlistPage() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>

            {/* Empty State */}
            <div className="text-center py-12">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-2xl font-semibold mb-4">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-8">
                    Save items you love by clicking the heart icon on product cards.
                </p>
                <Link
                    href="/shop"
                    className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                    Browse Products
                </Link>
            </div>
        </div>
    );
}

