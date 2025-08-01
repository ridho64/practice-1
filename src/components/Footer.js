import {
    Instagram,
    Twitter,
    Facebook,
  } from "lucide-react";
  
  export default function Footer() {
    return (
      <footer className="bg-[#5a3d2b] text-white px-6 py-10 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            <h3 className="text-lg font-bold mb-3 tracking-wide">The Fit</h3>
            <p className="text-gray-200 leading-relaxed">
              Curated essentials for men and women. Minimal. Stylish. Timeless.
            </p>
          </div>
  
          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-2 tracking-wide">Shop</h4>
            <ul className="space-y-1 text-gray-300">
              <li><a href="/products" className="hover:text-white">All Products</a></li>
              <li><a href="/men" className="hover:text-white">Men</a></li>
              <li><a href="/women" className="hover:text-white">Women</a></li>
              <li><a href="/accessories" className="hover:text-white">Accessories</a></li>
            </ul>
          </div>
  
          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-2 tracking-wide">Support</h4>
            <ul className="space-y-1 text-gray-300">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
              <li><a href="#" className="hover:text-white">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
  
          {/* Social Icons */}
          <div>
            <h4 className="font-semibold mb-2 tracking-wide">Connect</h4>
            <div className="flex space-x-4 mt-2 text-gray-300">
              <a href="#" title="Instagram" className="hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" title="Twitter" className="hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" title="Facebook" className="hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
  
        <div className="text-center mt-10 text-gray-400 text-xs">
          &copy; 2025 The Fit. All rights reserved.
        </div>
      </footer>
    );
  }
  