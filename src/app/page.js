"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { homepageLanding } from "@/lib/data/homepageLanding";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products?featured=true");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen text-[#3e2e2e]">

      {/* 🎯 HERO SECTION */}
      <section
        className="relative w-full h-[75vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url('${homepageLanding.heroBanner.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="z-10 max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            {homepageLanding.heroBanner.title}
          </h1>
          <p className="text-lg md:text-2xl mb-6 text-white/90">
            {homepageLanding.heroBanner.subtitle}
          </p>
          <Link
            href="/products"
            className="bg-[#a97458] hover:bg-[#8b5a3b] text-white py-3 px-8 rounded-full text-base font-medium transition"
          >
            {homepageLanding.heroBanner.buttonText}
          </Link>
        </div>
      </section>

      {/* 🌟 FEATURED PICKS */}
      <section className="py-16 px-4 sm:px-6 bg-[#f9f8f6]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#5a3d2b] text-center mb-2">
            Featured Picks
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Handpicked essentials you will love
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 🧘‍♀️ TAGLINE / BREAK SECTION */}
      <section
        className="py-20 px-6 bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: `url('${homepageLanding.tagline.background}')`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center p-8 sm:p-10 rounded-xl ">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {homepageLanding.tagline.title}
          </h2>
          <p className="text-lg">
            {homepageLanding.tagline.description}
          </p>
        </div>
      </section>

      {/* 🔥 TRENDING SECTION */}
      <section className="py-16 px-4 sm:px-6 bg-[#fdfdfc]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#5a3d2b] text-center mb-2">
            Trending Now
          </h2>
          <p className="text-gray-500 text-center mb-10">
             See what is making waves this season
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {products.slice(4, 10).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 🧩 SHOP BY CATEGORY */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#5a3d2b] text-center mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Browse essentials by type
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {homepageLanding.categories.map((category) => (
              <Link
                key={category.title}
                href={`/products?category=${category.slug}`}
                className="overflow-hidden rounded-xl shadow hover:shadow-md transition"
              >
                <img
                  src={category.img}
                  alt={category.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4 text-center bg-[#fdfdfc]">
                  <h3 className="text-lg font-semibold text-[#3e2e2e]">
                    {category.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
