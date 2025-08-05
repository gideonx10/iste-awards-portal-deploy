'use client';

import { Inter } from 'next/font/google';
import AuthSessionProvider from '@/providers/SessionProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-white text-gray-900 min-h-screen flex flex-col ${inter.className}`}>
        <AuthSessionProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
