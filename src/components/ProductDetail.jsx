"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { useUser } from "@/lib/auth/useUser";

export default function ProductDetail({ slug }) {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart, loadCart } = useCartStore();
  const user = useUser();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [buttonState, setButtonState] = useState("idle");

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images?.[0] || "");
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (user !== undefined) loadCart(user);
  }, [user]);

  const isInWishlist = product && wishlist.some((item) => item._id === product._id);

  const toggleWishlist = () => {
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlist(product._id, user);
    } else {
      addToWishlist(product, user);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length) {
      setSizeError(true);
      return;
    }

    setButtonState("loading");

    setTimeout(() => {
      addToCart(
        {
          productId: product._id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          slug: product.slug,
          quantity,
          size: selectedSize,
          color: product.color || "default",
        },
        user
      );

      setButtonState("success");
      setTimeout(() => setButtonState("idle"), 1500);
    }, 1000);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
        Loading...
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Product not found
      </div>
    );

  return (
    <div className="min-h-screen bg-white px-4 py-10 pt-28 text-gray-900">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
      
      {/* 🖼️ Image Section */}
      <div className="space-y-4">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-[500px] object-cover rounded-md"
        />
        <div className="flex gap-2 justify-center">
          {product.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`w-16 h-16 object-cover rounded border transition cursor-pointer ${
                mainImage === img ? "border-black" : "border-gray-200"
              } hover:opacity-80`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>
  
      {/* ℹ️ Info Section */}
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-light tracking-wide uppercase">{product.name}</h1>
  
        <p className="text-xl font-medium text-black">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
  
        <p className="text-sm text-gray-600">{product.excerpt}</p>
  
        {/* Size Selector */}
        {product.sizes?.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              Size
            </label>
            <select
              className={`mt-1 p-2 border-b border-black bg-transparent focus:outline-none ${
                sizeError ? "border-red-500" : ""
              }`}
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value);
                setSizeError(false);
              }}
            >
              <option value="">Choose an option</option>
              {product.sizes.map((size, index) => (
                <option key={index}>{size}</option>
              ))}
            </select>
            {sizeError && (
              <p className="text-red-500 text-xs mt-1">Please select a size.</p>
            )}
          </div>
        )}
  
        {/* Wishlist */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleWishlist}
            className="text-black text-2xl"
          >
            {wishlist.some((item) => item._id === product._id)
              ? <AiFillHeart />
              : <AiOutlineHeart />}
          </button>
        </div>
  
        {/* Quantity and Add to Cart */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded overflow-hidden">
              <button
                className="px-3 py-2 text-black disabled:opacity-30"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity === 1}
              >
                −
              </button>
              <span className="px-4 text-sm">{quantity}</span>
              <button
                className="px-3 py-2 text-black"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>
  
          <button
            onClick={handleAddToCart}
            disabled={buttonState === "loading"}
            className={`w-full py-3 rounded text-sm font-semibold tracking-wide uppercase transition
              ${
                buttonState === "loading"
                  ? "bg-gray-300 text-white cursor-wait"
                  : "bg-black text-white hover:opacity-90"
              }`}
          >
            {buttonState === "idle" && "Add to Cart"}
            {buttonState === "loading" && "Adding..."}
            {buttonState === "success" && "Added!"}
          </button>
        </div>
  
        {/* Description */}
        <div className="border-t pt-6 text-sm space-y-2">
          <h3 className="font-semibold uppercase tracking-wide">Description</h3>
          <p className="text-gray-700">{product.description}</p>
  
          <div className="text-xs text-gray-500 pt-4">
            <p>Free Global Shipping: <strong>Tue, Jan 28 – Thu, Jan 30</strong></p>
            <p>Secure 256-bit SSL encrypted payment</p>
          </div>
        </div>
  
        <Link
          href="/products"
          className="inline-block mt-10 text-sm text-gray-500 hover:underline"
        >
          ← Back to Products
        </Link>
      </div>
    </div>
  </div>
  
  );
  
}
