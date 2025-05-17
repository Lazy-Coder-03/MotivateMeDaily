import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Using Geist as a single font family for simplicity
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/AppHeader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MotivateMe',
  description: 'Get your daily dose of personalized motivation.',
  manifest: '/manifest.json', // Added manifest link here for Next.js metadata
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* For older browsers or specific PWA setups, direct link can be useful */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* theme-color can also be set here, though Next.js metadata should handle it via manifest */}
        <meta name="theme-color" content="#B38600" />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
