import { create } from "zustand";

export const useWishlistStore = create((set, get) => ({
  wishlist: [],

  setWishlist: (newWishlist) => set({ wishlist: newWishlist }),

  

  loadWishlist: async (user) => {
    if (!user) {
      // 🧑‍🦱 Guest — load from localStorage
      const local = localStorage.getItem("guest_wishlist");
      const items = local ? JSON.parse(local) : [];
      set({ wishlist: items });
      return;
    }
  
    // 👤 Logged in — load from DB
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) throw new Error("Failed to load wishlist");
  
      const items = await res.json();
      set({ wishlist: items });
    } catch (err) {
      console.error("Error loading wishlist:", err.message || err);
    }
  },
  
  

  addToWishlist: async (product, user) => {
    if (!product || !product._id) return;
  
    if (!user) {
      // Guest → localStorage
      const local = localStorage.getItem("guest_wishlist");
      let items = local ? JSON.parse(local) : [];
  
      const exists = items.some((p) => p._id === product._id);
      if (!exists) {
        items.push(product);
        localStorage.setItem("guest_wishlist", JSON.stringify(items));
        set({ wishlist: items });
      }
      return;
    }
  
    // Logged in → DB
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
  
      if (!res.ok) throw new Error("Failed to add to wishlist");
  
      await get().loadWishlist(user);
    } catch (err) {
      console.error("Error adding to wishlist:", err.message || err);
    }
  },
  

  removeFromWishlist: async (productId, user) => {
    if (!productId) return;
  
    if (!user) {
      // Guest → localStorage
      const local = localStorage.getItem("guest_wishlist");
      let items = local ? JSON.parse(local) : [];
  
      const updated = items.filter((p) => p._id !== productId);
      localStorage.setItem("guest_wishlist", JSON.stringify(updated));
      set({ wishlist: updated });
      return;
    }
  
    // Logged in → DB
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
  
      if (!res.ok) throw new Error("Failed to remove from wishlist");
  
      await get().loadWishlist(user);
    } catch (err) {
      console.error("Error removing from wishlist:", err.message || err);
    }
  },

  mergeLocalWishlistToDatabase: async (user) => {
    if (!user) return;
  
    const local = localStorage.getItem("guest_wishlist");
    const guestItems = local ? JSON.parse(local) : [];
  
    if (!guestItems.length) return;
  
    console.log("💖 Merging guest wishlist into DB...", guestItems);
  
    for (const product of guestItems) {
      try {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        });
      } catch (err) {
        console.error("❌ Failed to merge wishlist item", product._id, err);
      }
    }
  
    localStorage.removeItem("guest_wishlist");
    console.log("✅ Guest wishlist merged and cleared");
  }
  
  
}));
