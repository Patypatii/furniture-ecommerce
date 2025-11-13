'use client';

import { useState } from 'react';

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);

    // TODO: Fetch reviews from API
    const reviews = [];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    Write a Review
                </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold mb-4">Write Your Review</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                                    >
                                        ⭐
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Review Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="Give your review a title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Your Review</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                placeholder="Tell us what you think about this product"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                Submit Review
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Review items would go here */}
                </div>
            )}
        </div>
    );
}

