'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { ICategory } from '@tangerine/shared';
import { getCategoryImageUrl } from '@/lib/imagekit';

const defaultCategories = [
    {
        _id: '1',
        name: 'Living Room',
        slug: 'living-room',
        description: 'Sofas, coffee tables, TV stands, and more',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        order: 1,
        isActive: true,
    },
    {
        _id: '2',
        name: 'Beds',
        slug: 'beds',
        description: 'Quality beds for a restful sleep',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/bedroom-categories-scaled-qkr2tbqbg6jcbtwfh720uf14f5mfhb7fduyloae9kk.jpg',
        order: 2,
        isActive: true,
    },
    {
        _id: '3',
        name: 'Dining Sets',
        slug: 'dining-sets',
        description: 'Dining tables and chairs for family gatherings',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/dining-category-scaled-qkjbggyhh3glqq1kg2cha89u6ykw3q6u11t6e9smic.jpg',
        order: 3,
        isActive: true,
    },
    {
        _id: '4',
        name: 'Office',
        slug: 'office',
        description: 'Desks, office chairs, and storage',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        order: 4,
        isActive: true,
    },
    {
        _id: '5',
        name: 'Outdoor',
        slug: 'outdoor',
        description: 'Patio furniture and garden decor',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        order: 5,
        isActive: true,
    },
    {
        _id: '6',
        name: 'Storage',
        slug: 'storage',
        description: 'Shelves, cabinets, and organizers',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        order: 6,
        isActive: true,
    },
    {
        _id: '7',
        name: 'Hotel & Restaurants',
        slug: 'hotel-restaurants',
        description: 'Commercial furniture for hotels and restaurants',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/dining-category-scaled-qkjbggyhh3glqq1kg2cha89u6ykw3q6u11t6e9smic.jpg',
        order: 7,
        isActive: true,
    },
];

export default function Categories() {
    const [categories, setCategories] = useState<ICategory[]>(defaultCategories);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // TODO: Replace with actual API call
        const fetchCategories = async () => {
            try {
                // const response = await fetch('/api/categories');
                // const data = await response.json();
                // setCategories(data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        // Uncomment when API is ready
        // fetchCategories();
    }, []);

    return (
        <div className="container mx-auto px-4">
            <ScrollReveal>
                <h2 className="text-4xl font-bold text-center mb-4">Shop by Category</h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Browse our curated collections for every room in your home
                </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <ScrollReveal key={category._id} delay={index * 0.1}>
                        <Link href={`/products?category=${category.slug}`}>
                            <motion.div
                                className="group relative h-64 rounded-lg overflow-hidden cursor-pointer"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={getCategoryImageUrl(category.slug)}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
                                </div>

                                {/* Content */}
                                <div className="relative h-full flex flex-col items-center justify-center text-white p-6 text-center">
                                    <h3 className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                                        {category.name}
                                    </h3>
                                    {category.description && (
                                        <p className="text-sm opacity-90 mb-4">{category.description}</p>
                                    )}
                                    <span className="inline-block px-6 py-2 border-2 border-white rounded-full text-sm font-semibold group-hover:bg-white group-hover:text-primary transition-colors duration-300">
                                        Explore
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );
}

