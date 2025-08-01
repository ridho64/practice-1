import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],
  selectedItems: [],

  // --- CART STATE UPDATERS ---
  setCart: (items) => set({ cart: items }),
  setSelectedItems: (items) => set({ selectedItems: items }),

  // --- SELECTION LOGIC ---
  toggleSelectItem: (itemId) => {
    const selected = get().selectedItems;
    const isSelected = selected.includes(itemId);
    set({
      selectedItems: isSelected
        ? selected.filter((id) => id !== itemId)
        : [...selected, itemId],
    });
  },

  selectAll: () => {
    const allIds = get().cart.map((item) => item._id);
    set({ selectedItems: allIds });
  },

  clearSelectedItems: () => set({ selectedItems: [] }),

  // --- LOAD CART ---
  loadCart: async (user) => {
    if (user) {
      // Logged in: fetch from DB
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Failed to load cart");

        const items = await res.json();
        set({ cart: items });
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    } else {
      // Guest: load from localStorage
      try {
        const local = localStorage.getItem("guest_cart");
        const items = local ? JSON.parse(local) : [];
        set({ cart: items });
      } catch (err) {
        console.error("Error loading guest cart:", err);
      }
    }
  },

  // --- ADD TO CART ---
  addToCart: async (item, user) => {
    try {
      const payload = {
        productId: item.productId,
        size: item.size || "default",
        color: item.color || "default",
        quantity: item.quantity || 1,
      };

      if (user) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        console.log("🛒 Response status:", res.status, "body:", text);

        if (!res.ok) throw new Error(`Add to cart failed: ${text}`);

        await get().loadCart(user);
      } else {
        const existing = localStorage.getItem("guest_cart");
        let cart = existing ? JSON.parse(existing) : [];

        const index = cart.findIndex(
          (p) =>
            p.productId === payload.productId &&
            p.size === payload.size &&
            p.color === payload.color
        );

        if (index >= 0) {
          cart[index].quantity += payload.quantity;
        } else {
          cart.push({
            ...payload,
            name: item.name,
            image: item.image,
            price: item.price,
            slug: item.slug,
          });
        }

        localStorage.setItem("guest_cart", JSON.stringify(cart));
        set({ cart });
      }
    } catch (err) {
      console.error("🔥 Error in addToCart:", err.message || err);
    }
  },

  // --- REMOVE FROM CART ---
  removeFromCart: async (item, user) => {
    try {
      const payload = {
        productId: item.productId,
        size: item.size || "default",
        color: item.color || "default",
      };

      if (user) {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to remove from cart");

        await get().loadCart(user);
      } else {
        const local = localStorage.getItem("guest_cart");
        let cart = local ? JSON.parse(local) : [];

        const updated = cart.filter(
          (p) =>
            !(
              p.productId === payload.productId &&
              p.size === payload.size &&
              p.color === payload.color
            )
        );

        localStorage.setItem("guest_cart", JSON.stringify(updated));
        set({ cart: updated });
      }
    } catch (err) {
      console.error("🔥 Error removing from cart:", err.message || err);
    }
  },

  // --- UPDATE QUANTITY ---
  updateQuantity: async (item, user) => {
    try {
      const payload = {
        productId: item.productId,
        size: item.size || "default",
        color: item.color || "default",
        quantity: item.quantity,
      };

      if (user) {
        const res = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update quantity");

        await get().loadCart(user);
      } else {
        const local = localStorage.getItem("guest_cart");
        let cart = local ? JSON.parse(local) : [];

        const index = cart.findIndex(
          (p) =>
            p.productId === payload.productId &&
            p.size === payload.size &&
            p.color === payload.color
        );

        if (index >= 0) {
          cart[index].quantity = payload.quantity;
          localStorage.setItem("guest_cart", JSON.stringify(cart));
          set({ cart });
        }
      }
    } catch (err) {
      console.error("🔥 Error updating quantity:", err.message || err);
    }
  },

  // --- CLEAR CART ---
  clearCart: () => set({ cart: [], selectedItems: [] }),
}));
