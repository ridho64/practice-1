// lib/auth/useUser.js
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function useUser() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Only fetch if user state hasn't been set yet
    if (user !== undefined) return;

    const checkUser = async () => {
      try {
        const res = await fetch("/api/protected");
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    };

    checkUser();
  }, [user, setUser]);

  return user;
}
