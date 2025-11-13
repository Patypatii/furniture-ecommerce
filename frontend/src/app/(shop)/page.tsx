import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';

export const metadata: Metadata = {
  title: 'Home',
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Parallax */}
      <Hero />

      {/* Featured Products */}
      <section className="py-20">
        <FeaturedProducts />
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary/30">
        <Categories />
      </section>

      {/* Why Choose Us with Animations */}
      <section className="py-20">
        <WhyChooseUs />
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-secondary/20">
        <Testimonials />
      </section>

      {/* AI Chatbot & WhatsApp button now in layout - available on all pages */}
    </main>
  );
}

