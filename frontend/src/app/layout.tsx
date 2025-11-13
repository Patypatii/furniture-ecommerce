import type { Metadata } from 'next';
import { Inter, Roboto_Slab } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import LoadingBar from '@/components/common/LoadingBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
});

export const metadata: Metadata = {
  title: {
    default: 'Tangerine Furniture | Premium Furniture Store in Kenya',
    template: '%s | Tangerine Furniture',
  },
  description: 'Discover premium furniture for your home. Sofas, beds, dining sets, and more. Fast delivery across Kenya. Modern designs, quality craftsmanship.',
  keywords: ['furniture', 'Kenya', 'Nairobi', 'Mombasa', 'sofas', 'beds', 'dining tables', 'home decor'],
  authors: [{ name: 'Tangerine Furniture' }],
  creator: 'Tangerine Furniture',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://tangerinefurniture.co.ke',
    siteName: 'Tangerine Furniture',
    title: 'Tangerine Furniture | Premium Furniture Store in Kenya',
    description: 'Discover premium furniture for your home. Fast delivery across Kenya.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tangerine Furniture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tangerine Furniture | Premium Furniture Store in Kenya',
    description: 'Discover premium furniture for your home. Fast delivery across Kenya.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${robotoSlab.variable} font-sans antialiased`}>
        <Providers>
          <LoadingBar />
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}

