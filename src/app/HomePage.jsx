// app/page.jsx or HomePage.jsx

"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import mockProducts from "@/lib/mockProducts";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 text-[#3e2e2e]">

      {/* 🧢 HERO BANNER */}
      <section
        className="relative w-full h-[80vh] overflow-hidden flex flex-col items-center justify-center text-center text-white px-4"
        style={{
          backgroundImage: "url('https://image.pollinations.ai/prompt/casual%20fashion%20flatlay%20with%20beige%20hoodie,%20denim%20jeans,%20sneakers%20and%20accessories%20on%20soft-blue%20background')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black/20 w-full h-full absolute top-0 left-0 z-0" />
        <div className="z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">Welcome to the Fit</h1>
          <p className="text-2xl md:text-3xl mb-6">
            Casual fashion made for everyday life. Stay cool, comfy, and confident.
          </p>
          <button className="bg-[#a97458] hover:bg-[#8b5a3b] text-white py-3 px-8 rounded-full text-lg font-semibold transition">
            Start Shopping
          </button>
        </div>
      </section>

      {/* 🛍️ BEST PRODUCTS SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#5a3d2b] mb-10 text-center relative">
          Best Products
          <span className="block w-10 h-1 bg-[#a97458] mx-auto mt-2 rounded"></span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {mockProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ✨ SIMPLE TAGLINE SECTION */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-[#5a3d2b] mb-6">
          Essentials for Everyday Life
        </h2>
        <p className="text-lg text-[#6b7280]">
          Discover timeless designs made to simplify your wardrobe and elevate your comfort.
        </p>
      </section>

      {/* 🛒 SHOP BY CATEGORY SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#5a3d2b] mb-10 text-center relative">
          Shop by Category
          <span className="block w-10 h-1 bg-[#a97458] mx-auto mt-2 rounded"></span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            {
              title: "Hoodies",
              img: "https://image.pollinations.ai/prompt/beige%20hoodie%20on%20white%20background",
            },
            {
              title: "Minimalist Jewelry",
              img: "https://image.pollinations.ai/prompt/minimalist%20gold%20jewelry%20studio%20photo",
            },
            {
              title: "Basic T-Shirts",
              img: "https://image.pollinations.ai/prompt/basic%20black%20tshirt%20flat%20lay",
            },
          ].map((category) => (
            <div key={category.title} className="overflow-hidden rounded-xl shadow hover:shadow-lg transition">
              <img src={category.img} alt={category.title} className="w-full h-60 object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🧹 FOOTER */}
      <footer className="bg-[#5a3d2b] text-white text-center py-8">
        <p className="text-sm">&copy; 2025 The Fit. All rights reserved.</p>
      </footer>

    </main>
  );
}
