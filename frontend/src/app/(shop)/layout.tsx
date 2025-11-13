import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/ai/ChatBot';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            {children}
            <Footer />
            {/* Global floating components - appear on all pages */}
            <ChatBot />
            <WhatsAppButton />
        </>
    );
}

