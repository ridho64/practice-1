"use client";

import { useEffect } from "react";
import { useUser } from "@/lib/auth/useUser";
import { useWishlistStore } from "@/lib/store/useWishlistStore";

export default function  MergeGuestWishlistOnLogin() {
  const user = useUser();
  const { mergeLocalWishlistToDatabase } = useWishlistStore();

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      mergeLocalWishlistToDatabase(user); // merges & clears local
    }
  }, [user]);

  return null;
}
