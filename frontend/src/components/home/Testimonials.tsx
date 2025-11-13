'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Homeowner',
        image: '/images/testimonials/user1.jpg',
        rating: 5,
        text: 'The quality of the furniture exceeded my expectations. The custom sofa I ordered fits perfectly in my living room and the craftsmanship is outstanding.',
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Interior Designer',
        image: '/images/testimonials/user2.jpg',
        rating: 5,
        text: 'I recommend Tangerine to all my clients. Their attention to detail and customer service is unmatched. The delivery was seamless and professional.',
    },
    {
        id: 3,
        name: 'Emma Williams',
        role: 'Business Owner',
        image: '/images/testimonials/user3.jpg',
        rating: 5,
        text: 'Furnished my entire office with Tangerine. The modern designs and sustainable materials align perfectly with our company values. Highly recommended!',
    },
    {
        id: 4,
        name: 'David Martinez',
        role: 'Architect',
        image: '/images/testimonials/user4.jpg',
        rating: 5,
        text: 'The 3D visualization feature helped my clients see exactly what they were getting. The final product matched the preview perfectly. Game changer!',
    },
];

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextTestimonial = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const activeTestimonial = testimonials[activeIndex];

    return (
        <div className="container mx-auto px-4">
            <ScrollReveal>
                <h2 className="text-4xl font-bold text-center mb-4">What Our Customers Say</h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Don't just take our word for it - hear from our satisfied customers
                </p>
            </ScrollReveal>

            <div className="max-w-4xl mx-auto">
                {/* Main Testimonial Card */}
                <div className="relative min-h-[300px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTestimonial.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
                        >
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold mb-6">
                                    {activeTestimonial.name.charAt(0)}
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-2xl">
                                            ⭐
                                        </span>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-lg md:text-xl text-gray-700 mb-6 italic">
                                    "{activeTestimonial.text}"
                                </p>

                                {/* Author Info */}
                                <div>
                                    <h4 className="font-bold text-xl">{activeTestimonial.name}</h4>
                                    <p className="text-gray-500">{activeTestimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center"
                        aria-label="Previous testimonial"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center"
                        aria-label="Next testimonial"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex
                                    ? 'bg-primary w-8'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

