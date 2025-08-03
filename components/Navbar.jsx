'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#e6c78e] px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-bold text-black">
        ISTE Awards Portal
      </Link>
      <div className="space-x-6">
        <Link
          href="https://istegujarat.in"
          className="text-black hover:text-white transition"
          target="_blank"
        >
          ISTE Gujarat Website
        </Link>
        <Link href="#how-to-apply" className="text-black hover:text-white transition">
          How to Apply
        </Link>
      </div>
    </nav>
  );
}
