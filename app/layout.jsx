'use client';

import { Inter } from 'next/font/google';
import SupabaseSessionProvider from '@/components/SessionProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css'; // make sure this exists if using Tailwind

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-white text-gray-900 min-h-screen flex flex-col ${inter.className}`}>
        <SupabaseSessionProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
