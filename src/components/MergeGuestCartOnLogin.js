// components/MergeGuestCartOnLogin.jsx
"use client";
import { useUser } from "@/lib/auth/useUser";
import { useEffect } from "react";

export function MergeGuestCartOnLogin() {
  const user = useUser();

  useEffect(() => {
    if (!user) return;

    const mergeCart = async () => {
      const local = localStorage.getItem("guest_cart");
      const guestItems = local ? JSON.parse(local) : [];

      if (guestItems.length === 0) return;

      console.log("🛒 Merging guest cart into DB...", guestItems);

      for (const item of guestItems) {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
            }),
          });
        } catch (err) {
          console.error("❌ Failed to merge item:", item, err);
        }
      }

      // ✅ Clear guest cart after merge
      localStorage.removeItem("guest_cart");
      console.log("✅ Guest cart merged and cleared");
    };

    mergeCart();
  }, [user]);

  return null;
}
