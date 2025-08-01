"use client";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useUser } from "@/lib/auth/useUser";
import Link from "next/link";

export default function ProductCard({ product }) {
  const user = useUser(); // ✅ Get login state
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  // ✅ Check by comparing _id field (objects or localStorage)
  const isInWishlist = wishlist.some((item) => item._id === product._id);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isInWishlist) {
      removeFromWishlist(product._id, user); // ✅ pass user
    } else {
      addToWishlist(product, user); // ✅ full product object
    }
  };

  return (
    <Link
    href={`/products/${product.slug}`}
    className="group block bg-white"
  >
    <div className="relative">
      {/* 🖤 Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-4 right-4 z-10 text-black text-xl"
      >
        {isInWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>
  
      {/* 🖼️ Full-bleed Image */}
      <div className="aspect-[4/5] bg-white overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  
    {/* 🧾 Product Info */}
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
  
  
  );
}
