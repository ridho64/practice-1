"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" }); // ✅ improved type
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "Registering...", type: "" });

    if (form.password !== form.confirmPassword) {
      setMessage({ text: "❌ Passwords do not match", type: "error" });
      setLoading(false);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      // Auto-login
      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (loginRes.ok) {
        const userRes = await fetch("/api/protected");
        const userData = await userRes.json();
        setUser(userData.user);
        setForm({ name: "", email: "", password: "", confirmPassword: "" }); // ✅ clear form
        setMessage({ text: "✅ Welcome!", type: "success" });
        router.push("/");
      } else {
        setMessage({ text: "✅ Registered, but please log in manually.", type: "success" });
        router.push("/login");
      }
    } else {
      const firstError =
        data.error?.email?.[0] || data.error?.password?.[0] || data.error;
      setMessage({ text: `❌ ${firstError}`, type: "error" });
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-28 px-6 bg-white text-[#3e2e2e]">
      <div className="max-w-md mx-auto w-full">
      <AnimatePresence>
          {!loading && message.text && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 p-4 px-6 rounded-lg shadow text-white text-sm ${
                message.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-3xl font-bold mb-6 text-center">Create Your Account</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 border rounded placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-[#a97458]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={loading} 
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
              disabled={loading} 
              className="w-full px-4 py-2 border rounded placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-[#a97458]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading} 
              className="w-full px-4 py-2 border rounded placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-[#a97458]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#a97458] underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
