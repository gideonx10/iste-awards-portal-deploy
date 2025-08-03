'use client';

export default function Footer() {
  return (
    <footer className="bg-[#0b254e] text-white py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
        <p className="mb-1">
          <strong>Dr B. V. Bhatt</strong> (Hon. Secretary cum Treasurer ISTE Gujarat)
        </p>
        <p className="mb-1">
          Address: Plot No. 19, Mangal Vihar Row House, B/H. Gangeshwar Mahadev Temple,
          Chhatrapati Shivaji Marg, Adajan, Surat - 395009 GJ-IN
        </p>
        <p className="mb-1">Mobile/WhatsApp: +91-98258-35364</p>
        <p className="mb-4">Email: istegujsecretary@gmail.com</p>
        <hr className="border-gray-600 my-4" />
        <p className="text-sm text-gray-300">
          © Copyright Reserved by ISTE Gujarat Section
        </p>
      </div>
    </footer>
  );
}
