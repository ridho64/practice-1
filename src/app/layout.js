"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { useUser } from "@/lib/auth/useUser";
import { MergeGuestCartOnLogin } from "@/components/MergeGuestCartOnLogin";
import MergeGuestWishlistOnLogin from "@/components/MergeGuestWishlistOnLogin";
import "./globals.css";

// 👉 Import fonts
import { Playfair_Display, Source_Sans_3 } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-playfair",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
});


export default function RootLayout({ children }) {
  const pathname = usePathname();
  const user = useUser();

  useEffect(() => {
    if (user !== undefined) {
      useWishlistStore.getState().loadWishlist(user);
    }
  }, [user]);

  useEffect(() => {
    if (user !== undefined) {
      useCartStore.getState().loadCart(user);
    }
  }, [user]);

  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body>
        <MergeGuestCartOnLogin />
        <MergeGuestWishlistOnLogin />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
