import { Metadata } from 'next';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Tangerine Furniture - our story, values, and commitment to quality.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <section className="relative h-96 mb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-600/90" />
                <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
                    <div className="text-center text-white">
                        <h1 className="text-5xl font-bold mb-4">About Tangerine Furniture</h1>
                        <p className="text-xl max-w-2xl mx-auto">
                            Crafting premium furniture with passion and precision since 2015
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="container mx-auto px-4 py-16">
                <ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                            <p className="text-gray-600 mb-4">
                                Founded in 2015 in Nairobi, Kenya, Tangerine Furniture began with a simple vision:
                                to bring premium, locally-crafted furniture to homes across East Africa.
                            </p>
                            <p className="text-gray-600 mb-4">
                                What started as a small workshop has grown into one of Kenya's most trusted furniture
                                brands, serving thousands of satisfied customers and expanding our reach across the region.
                            </p>
                            <p className="text-gray-600">
                                Today, we combine traditional craftsmanship with modern design and technology, including
                                AR visualization, to help you create the perfect living space.
                            </p>
                        </div>
                        <div className="relative h-96 rounded-lg overflow-hidden">
                            <div className="w-full h-full bg-gray-200" />
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* Our Values */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <ScrollReveal>
                        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🎨',
                                title: 'Quality Craftsmanship',
                                description: 'Every piece is handcrafted by skilled artisans using premium materials and time-tested techniques.',
                            },
                            {
                                icon: '♻️',
                                title: 'Sustainability',
                                description: 'We source materials responsibly and use eco-friendly practices throughout our production process.',
                            },
                            {
                                icon: '🤝',
                                title: 'Customer First',
                                description: 'Your satisfaction is our priority. We offer personalized service and stand behind every product we sell.',
                            },
                        ].map((value, index) => (
                            <ScrollReveal key={index} delay={index * 0.1}>
                                <div className="bg-white p-8 rounded-lg text-center">
                                    <div className="text-5xl mb-4">{value.icon}</div>
                                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="container mx-auto px-4 py-16">
                <ScrollReveal>
                    <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
                </ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {['John Kamau', 'Sarah Wanjiku', 'David Omondi', 'Grace Njeri'].map((name, index) => (
                        <ScrollReveal key={index} delay={index * 0.1}>
                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white text-3xl font-bold">
                                    {name.charAt(0)}
                                </div>
                                <h3 className="font-bold text-lg">{name}</h3>
                                <p className="text-gray-600 text-sm">Team Member</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="bg-primary text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: '10+', label: 'Years Experience' },
                            { number: '5000+', label: 'Happy Customers' },
                            { number: '50+', label: 'Expert Craftsmen' },
                            { number: '100%', label: 'Satisfaction Rate' },
                        ].map((stat, index) => (
                            <ScrollReveal key={index} delay={index * 0.1}>
                                <div>
                                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                                    <div className="text-sm opacity-90">{stat.label}</div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

