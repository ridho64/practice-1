"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { useUser } from "@/lib/auth/useUser";

export default function Navbar() {
  const user = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const { wishlist } = useWishlistStore();
  const { cart } = useCartStore();

  const linkClass = (href) =>
    `relative px-3 py-1 hover:text-[#a97458] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#a97458] after:transition-all after:duration-300 ${
      pathname === href ? "after:w-full text-[#a97458]" : ""
    }`;

  const isActiveLink = (type) => {
    const current = searchParams.get("gender") || searchParams.get("category");
    return current === type;
  };

  const menuSections = ["men", "women", "tops", "accessories"];

  const renderMegaMenu = (type) => {
    let categories;
    let image;

    if (type === "men") {
      categories = [
        { title: "Clothing", category: "clothing", items: ["Hoodies", "T-Shirts", "Jackets", "Pants"] },
        { title: "Shoes", category: "shoes", items: ["Sneakers", "Boots"] },
        { title: "Accessories", category: "accessories", items: ["Watches", "Hats"] },
      ];
      image = "https://image.pollinations.ai/prompt/fashion%20casual%20streetwear%20flatlay";
    } else if (type === "women") {
      categories = [
        { title: "Clothing", category: "clothing", items: ["Dresses", "Tops", "Skirts", "Jeans"] },
        { title: "Shoes", category: "shoes", items: ["Heels", "Flats"] },
        { title: "Accessories", category: "accessories", items: ["Watches", "Jewelry", "Bags"] },
      ];
      image = "https://image.pollinations.ai/prompt/minimalist%20fashion%20flatlay%20for%20women";
    } else if (type === "tops") {
      categories = [
        { title: "Men Tops", category: "tops", items: ["T-Shirts", "Hoodies", "Sweatshirts"] },
        { title: "Women Tops", category: "tops", items: ["Blouses", "Crop Tops", "Tunics"] },
      ];
      image = "https://image.pollinations.ai/prompt/minimal%20fashion%20tops%20flatlay";
    } else if (type === "accessories") {
      categories = [
        { title: "Accessories", category: "accessories", items: ["Hats", "Scarves", "Belts", "Sunglasses", "Watches"] },
      ];
      image = "https://image.pollinations.ai/prompt/minimalist%20fashion%20accessories%20flatlay";
    }

    return (
      <div className="hidden md:grid absolute left-1/2 top-full -translate-x-1/2 w-[900px] pt-4 p-8 bg-white shadow-lg border border-[#f1ebe5] grid-cols-4 gap-8 z-40 transition-opacity duration-300">
        {categories.map((cat) => (
          <div key={cat.title} className="flex flex-col gap-3">
            <h4 className="font-bold text-[#5a3d2b]">{cat.title}</h4>
            {cat.items.map((item) => {
              const params = new URLSearchParams();
              if (type === "men" || type === "women") {
                params.append("gender", type);
              }
              params.append("category", cat.category);
              params.append("subcategory", item.toLowerCase().replace(/\s+/g, "-"));

              return (
                <Link
                  key={item}
                  href={`/products?${params.toString()}`}
                  className={`hover:text-[#a97458] ${
                    searchParams.get("subcategory") === item.toLowerCase().replace(/\s+/g, "-")
                      ? "text-[#a97458] font-bold"
                      : "text-gray-500"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={image}
            alt="Featured"
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/fallback.jpg")}
          />
        </div>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm border-b border-[#f1ebe5] text-[#3e2e2e] z-50">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-3xl font-bold tracking-tight text-[#5a3d2b] heading">
            <div className="w-3 h-3 bg-[#a97458] rounded-full"></div>
            The Fit
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`hidden md:flex items-center gap-6 text-lg font-semibold`}> 
          <Link href="/" className={linkClass("/")}>Home</Link>
          {menuSections.map((section) => (
            <div
              key={section}
              className="relative"
              onMouseEnter={() => setHoveredMenu(section)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link
                href={`/products?${section === "tops" || section === "accessories" ? `category=${section}` : `gender=${section}`}`}
                className={`cursor-pointer relative px-3 py-1 hover:text-[#a97458] capitalize ${
                  isActiveLink(section) ? "text-[#a97458] font-bold" : ""
                }`}
              >
                {section}
              </Link>
              {hoveredMenu === section && renderMegaMenu(section)}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-5 text-lg font-semibold">
          {user ? (
            <Link href="/profile" className="hover:text-[#a97458]" aria-label="Dashboard">
              <FaUser className="text-2xl" />
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-1 hover:text-[#a97458]" aria-label="Sign In">
              <FaUser className="text-2xl" /> <span className="hidden md:inline">Sign In</span>
            </Link>
          )}

          <Link href="/wishlist" className="relative flex items-center hover:text-[#a97458]" aria-label="Wishlist">
            <FaHeart className="text-2xl" />
            {user !== undefined && wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#a97458] text-white text-[10px] font-medium rounded-full px-1.5 py-0.5 shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative flex items-center hover:text-[#a97458]" aria-label="Cart">
            <FaShoppingCart className="text-2xl" />
            {user !== undefined && cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#a97458] text-white text-[10px] font-medium rounded-full px-1.5 py-0.5 shadow-sm">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-white px-6 py-4 border-t border-[#eee0d5] space-y-3 text-lg font-semibold">
          <Link href="/" className="block" onClick={() => setMenuOpen(false)}>Home</Link>
          {menuSections.map((section) => (
            <Link
              key={section}
              href={`/products?${section === "tops" || section === "accessories" ? `category=${section}` : `gender=${section}`}`}
              className="block capitalize"
              onClick={() => setMenuOpen(false)}
            >
              {section}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
