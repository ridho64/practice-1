"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { landingData } from "@/lib/data/landingData";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const gender = searchParams.get("gender");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentLanding = gender ? landingData[gender] : landingData[category];
  const landingPage = !subcategory && (gender || category) && currentLanding;

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let url = "/api/products";
      const params = new URLSearchParams();

      if (gender) params.append("gender", gender);
      if (category) params.append("category", category);
      if (subcategory) params.append("subcategory", subcategory);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    }

    fetchProducts();
  }, [gender, category, subcategory]);

  return (
    <main className="pt-24 px-6 min-h-screen bg-[#fdfdfc] text-[#3e2e2e]">

      {/* ✅ Landing Hero + Suggested Section */}
      {landingPage ? (
        <>
          {/* Hero */}
          <section
            className="relative w-full h-[60vh] flex flex-col items-center justify-center text-center text-white mb-16 animate-fadeIn"
            style={{
              backgroundImage: `url('${currentLanding.heroImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black/40 absolute w-full h-full top-0 left-0 z-0" />
            <div className="z-10 px-4">
              <h1 className="text-5xl font-bold capitalize mb-2 animate-fadeIn delay-200">
                {gender ? gender : category} Collection
              </h1>
              <p className="text-lg animate-fadeIn delay-300">
                Explore timeless essentials curated for you.
              </p>
              <div className="mt-4 text-sm animate-fadeIn delay-400">
                <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
                {" / "}
                <span className="text-white capitalize">{gender ? gender : category}</span>
              </div>
            </div>
          </section>

          {/* Banners */}
          <div className="flex flex-col gap-8 max-w-5xl mx-auto mb-16">
            {currentLanding.banners.map((banner) => (
              <Link
                key={banner.href}
                href={banner.href}
                className="relative overflow-hidden rounded-xl shadow hover:shadow-lg group"
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold tracking-wide capitalize">
                    {banner.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Suggested */}
          <section className="text-center mb-8 animate-fadeIn delay-500">
            <h2 className="text-3xl font-bold text-[#5a3d2b]">Suggested for You</h2>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
            {currentLanding.suggested.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </>
      ) : (
        // ✅ Title if browsing subcategory only
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#5a3d2b] capitalize">
            {subcategory
              ? subcategory.replace(/-/g, " ")
              : category
              ? category
              : "All Products"}
          </h1>
          <p className="text-gray-500 mt-2">
            Discover timeless essentials for everyday life.
          </p>
        </section>
      )}

      {/* ✅ Grid of Products */}
      {!landingPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-auto mb-16">
          {loading ? (
            <div className="col-span-full text-center py-20">Loading...</div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <h2 className="text-2xl font-bold text-[#5a3d2b]">No products found.</h2>
              <p className="text-gray-500 mt-2">Please select another category.</p>
            </div>
          )}
        </div>
      )}

      {/* ✅ Smooth spacing before footer */}
      <div className="h-12 bg-[#fdfdfc]" />
    </main>
  );
}
