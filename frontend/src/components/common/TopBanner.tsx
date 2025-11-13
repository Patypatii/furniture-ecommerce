'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-2 px-4 relative z-50"
            >
                <div className="container mx-auto flex items-center justify-between">
                    {/* Left Side - Promo Message */}
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-sm md:text-base font-medium">
                            🎉 <span className="hidden sm:inline">Same Day Delivery in Nairobi |</span> 
                            <span className="mx-2">📞 Call:</span>
                            <a href="tel:+254791708894" className="hover:underline font-bold">
                                0791 708 894
                            </a>
                            <span className="mx-2">or</span>
                            <a href="tel:+2540111305770" className="hover:underline font-bold">
                                0111 305 770
                            </a>
                        </p>
                    </div>

                    {/* Right Side - CTA (Desktop Only) */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/contact-us"
                            className="text-sm font-semibold hover:underline"
                        >
                            Contact Us →
                        </Link>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Close banner"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

