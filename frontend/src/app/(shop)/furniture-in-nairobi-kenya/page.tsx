import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - Furniture in Nairobi, Kenya | Tangerine Furniture',
    description: 'Learn about Tangerine Furniture, your trusted furniture store in Nairobi, Kenya. Quality handcrafted furniture with timeless designs.',
};

export default function FurnitureInNairobiKenyaPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[400px] bg-gradient-to-r from-primary to-primary-600 text-white">
                <div className="container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-bold mb-6">
                            Furniture in Nairobi, Kenya
                        </h1>
                        <p className="text-xl opacity-90">
                            Crafting timeless furniture pieces that transform your space into a home
                        </p>
                    </div>
                </div>
            </div>

            {/* About Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Our Story */}
                    <section className="mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                        <div className="prose prose-lg text-gray-700 space-y-4">
                            <p>
                                Welcome to <strong>Tangerine Furniture</strong>, your premier furniture store in
                                Nairobi, Kenya. We specialize in creating beautiful, high-quality furniture that
                                brings style, comfort, and functionality to homes and businesses across Kenya.
                            </p>
                            <p>
                                Founded with a passion for exceptional craftsmanship and timeless design,
                                Tangerine Furniture has become a trusted name for quality furniture in Nairobi,
                                Mombasa, and throughout Kenya.
                            </p>
                        </div>
                    </section>

                    {/* What We Offer */}
                    <section className="mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">What We Offer</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-2xl font-bold text-primary mb-3">Living Room</h3>
                                <p className="text-gray-700">
                                    Sofas, coffee tables, TV stands, consoles, and accent pieces designed
                                    for comfort and elegance.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-2xl font-bold text-primary mb-3">Bedroom</h3>
                                <p className="text-gray-700">
                                    Quality beds and bedroom furniture crafted for a restful and
                                    luxurious sleep experience.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-2xl font-bold text-primary mb-3">Dining Room</h3>
                                <p className="text-gray-700">
                                    Elegant dining sets that bring family and friends together for
                                    memorable meals.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-2xl font-bold text-primary mb-3">Commercial</h3>
                                <p className="text-gray-700">
                                    Professional furniture solutions for hotels, restaurants, and
                                    commercial spaces.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className="mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Tangerine Furniture?</h2>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                    ✓
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Quality Craftsmanship</h4>
                                    <p>Every piece is carefully crafted with attention to detail and durability.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                    ✓
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Fast Delivery</h4>
                                    <p>Same-day delivery within Nairobi for ready-made orders.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                    ✓
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Sustainable Materials</h4>
                                    <p>We use eco-friendly materials and sustainable practices.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                    ✓
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Custom Solutions</h4>
                                    <p>Tailored furniture solutions to match your unique style and space.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg p-12">
                        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
                        <p className="text-lg mb-8 opacity-90">
                            Visit our showroom in Nairobi or shop online today!
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <a
                                href="/shop"
                                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                            >
                                Shop Now
                            </a>
                            <a
                                href="/contact"
                                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-primary transition-colors"
                            >
                                Contact Us
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

