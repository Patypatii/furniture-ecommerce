import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import ChatBot from '@/components/ai/ChatBot';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import TopBanner from '@/components/common/TopBanner';

export const metadata: Metadata = {
  title: 'Furniture Shop in Nairobi, Mombasa, Kenya | Tangerine Furniture',
  description: 'Furniture shop in Nairobi, Mombasa, Kenya. We make timeless sofas, dining sets, coffee tables, beds, accent chairs and TV stands. Same day delivery in Nairobi.',
};

export default function HomePage() {
  return (
    <>
      <TopBanner />
      <Header />
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

        {/* AI Chatbot */}
        <ChatBot />
      </main>
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </>
  );
}
