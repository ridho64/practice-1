"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store/useAuthStore"; // ✅ import Zustand store

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser); // ✅ get setter from Zustand

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Logging in...");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      // ✅ Fetch fresh user info and store it in Zustand
      try {
        const userRes = await fetch("/api/protected");
        const userData = await userRes.json();
        if (userRes.ok) setUser(userData.user);
        else setUser(null);
      } catch {
        setUser(null);
      }

      setMessage("✅ Login successful!");
      router.push("/");
    } else {
      const firstError =
        data.error?.email?.[0] || data.error?.password?.[0] || data.error;
      setMessage(`❌ ${firstError}`);
    }

    setLoading(false);
  };
  
  return (
    <main className="min-h-screen pt-28 px-6 bg-white text-[#3e2e2e]">
      <div className="max-w-md mx-auto w-full">
        <AnimatePresence>
          {!loading && message && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 p-4 px-6 rounded-lg shadow text-white text-sm ${
                message.includes("success") ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message.includes("success") || message.includes("❌") ? message : ""}
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-3xl font-bold mb-6 text-center">Login to The Fit</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border rounded placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-[#a97458]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border rounded placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-[#a97458]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-[#a97458] underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
