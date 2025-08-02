"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useUser } from "@/lib/auth/useUser";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, loadWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    if (user !== undefined) {
      loadWishlist(user).finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#3e2e2e] pt-24">
    <div className="mx-auto">
      <h1 className="text-4xl font-bold text-[#5a3d2b] mb-2 text-right">
        Wishlist
      </h1>
      <div className="w-10 h-1 bg-[#a97458] rounded mb-12 ml-auto"></div>
  
      {loading ? (
        <div className="text-center py-32 text-gray-500">Loading...</div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-lg text-gray-500 mb-6">
            You havent added anything yet.
          </p>
          <Link
            href="/products"
            className="bg-[#a97458] hover:bg-[#8b5a3b] text-white py-3 px-6 rounded-full text-base font-semibold transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {wishlist.map((product) => (
            <Link
              href={`/products/${product.slug}`}
              key={product._id}
              className="group block bg-white"
            >
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product._id, user);
                  }}
                  className="absolute top-4 right-4 z-10 text-black text-xl"
                >
                  <AiFillHeart />
                </button>
  
                <div className="aspect-[4/5] bg-white overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
  
              <div className="mt-3 text-center">
                <h2 className="text-sm font-light uppercase tracking-wide text-gray-900">
                  {product.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {product.excerpt}
                </p>
                <p className="text-sm font-medium text-black mt-2">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  </main>
  
  );
}
