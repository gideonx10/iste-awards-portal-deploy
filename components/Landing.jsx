'use client';

import Link from 'next/link';

export default function Landing() {
  const awards = [
    'Best Polytechnic Award',
    'Best Engineering College Award',
    'Best Faculty of the Year',
    'Outstanding Contribution to Technical Education',
    'Lifetime Achievement Award',
  ];

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mt-16 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
          Welcome to the ISTE Gujarat Awards Portal
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          A centralized platform to streamline award submissions and management,
          bringing transparency and scalability to honor technical excellence.
        </p>
        <div className="mt-6 space-x-4">
          <Link href="/login">
            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </section>

      {/* How to Apply */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3" id="how-to-apply">
          How to Apply
        </h2>
        <p className="text-gray-600">
          Submit nominations easily through our online portal. Select your award, fill in
          the required details, and upload necessary documents.
        </p>
      </section>

      {/* List of Awards */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">List of Awards</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((award, idx) => (
            <li
              key={idx}
              className="bg-gray-100 p-4 rounded hover:bg-gray-200 transition cursor-pointer"
            >
              <Link href={`/register/${idx}`} className="text-blue-600 font-medium">
                {award}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* About ISTE Section */}
      <section className="bg-yellow-50 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-3">About ISTE Gujarat Section</h2>
        <p className="text-gray-700">
          The ISTE Gujarat Section, established in 1989, aims to develop technical
          education at the state level. With over 6,500 life members and 30,000+ student
          members across 132 institutions, it plays a vital role in advancing engineering
          and technical education in Gujarat.
        </p>
        <p className="mt-3 text-gray-700">
          ISTE contributes actively to national initiatives like AICTE and NBA events and
          promotes excellence through conventions, seminars, and teacher development
          programs.
        </p>
      </section>
    </main>
  );
}
