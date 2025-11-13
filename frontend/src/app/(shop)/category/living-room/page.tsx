import { Metadata } from 'next';
import Link from 'next/link';
import ProductsGrid from '@/components/products/ProductsGrid';

export const metadata: Metadata = {
    title: 'Living Room Furniture | Tangerine Furniture',
    description: 'Explore our collection of living room furniture including sofas, coffee tables, TV stands, and more',
};

const livingRoomCategories = [
    {
        name: 'Sofas',
        href: '/products?category=sofas',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/products/sofa-qwbznzez6ecafcz2i0khdxjgm8oaxfhbaowvi3qo0y.png',
        description: 'Comfortable and stylish sofas for your living space'
    },
    {
        name: 'Coffee Tables',
        href: '/products?category=coffee-tables',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/additional/coffee-hero.webp',
        description: 'Elegant coffee tables to complete your living room'
    },
    {
        name: 'TV Stands',
        href: '/products?category=tv-stands',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        description: 'Modern TV stands with ample storage'
    },
    {
        name: 'Consoles & Cabinets',
        href: '/products?category=consoles-cabinets',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        description: 'Functional storage solutions for your living room'
    },
    {
        name: 'Accents',
        href: '/products?category=accents',
        image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        description: 'Decorative accent pieces to enhance your space'
    }
];

export default function LivingRoomPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-primary-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4">Living Room Furniture</h1>
                    <p className="text-xl opacity-90 max-w-2xl">
                        Transform your living space with our curated collection of sofas, coffee tables,
                        TV stands, and accent pieces designed for comfort and style.
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8 text-gray-900">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {livingRoomCategories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600">{category.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* All Products Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">All Living Room Products</h2>
                    <ProductsGrid />
                </div>
            </div>
        </div>
    );
}

