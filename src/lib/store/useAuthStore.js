import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: undefined, // undefined = checking, null = not logged in

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const res = await fetch("/api/protected");
      if (!res.ok) return set({ user: null });
      const data = await res.json();
      set({ user: data.user });
    } catch {
      set({ user: null });
    }
  },
}));
