'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';

const features = [
    {
        icon: '🚚',
        title: 'Fast Deliveries',
        description: 'Same day deliveries within Nairobi for ready made orders. Fast shipping to Mombasa, Kisumu and across Kenya.',
    },
    {
        icon: '🛋️',
        title: 'Function & Aesthetic Furniture',
        description: 'We prioritize function and beauty on all our pieces, making them both usable and appealing.',
    },
    {
        icon: '🌳',
        title: 'Durable, Premium Materials',
        description: 'Our raw materials are carefully picked to ensure they meet quality standards before use in the assembly process.',
    },
    {
        icon: '🎨',
        title: 'Custom Design',
        description: 'Personalize your furniture with custom colors, materials, and dimensions to match your style.',
    },
    {
        icon: '🏆',
        title: 'Quality Craftsmanship',
        description: 'Handcrafted furniture made with exceptional attention to detail by skilled artisans.',
    },
    {
        icon: '💰',
        title: 'Best Value',
        description: 'Competitive pricing with flexible payment options for quality furniture that lasts.',
    },
];

export default function WhyChooseUs() {
    return (
        <div className="container mx-auto px-4">
            <ScrollReveal>
                <h2 className="text-4xl font-bold text-center mb-4">We Are Solving the Biggest Problems in Furniture</h2>
                <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
                    Quality furniture with fast delivery, beautiful designs, and premium materials - all at competitive prices
                </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <ScrollReveal key={index} delay={index * 0.1}>
                        <motion.div
                            className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    </ScrollReveal>
                ))}
            </div>

            {/* Call to Action */}
            <ScrollReveal delay={0.6}>
                <div className="mt-16 text-center">
                    <motion.div
                        className="inline-block"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <a
                            href="/about"
                            className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg inline-block"
                        >
                            Learn More About Us
                        </a>
                    </motion.div>
                </div>
            </ScrollReveal>
        </div>
    );
}

