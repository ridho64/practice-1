"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useUser } from "@/lib/auth/useUser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const user = useUser();
  const {
    cart,
    selectedItems,
    clearSelectedItems,
    loadCart,
  } = useCartStore();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user !== undefined) {
      loadCart(user);
      fetchDefaultAddress();
    }
  }, [user]);

  const fetchDefaultAddress = async () => {
    try {
      const res = await fetch("/api/address");
      if (!res.ok) return;
      const data = await res.json();
      const defaultAddress = data.find((a) => a.isDefault);
      if (defaultAddress) {
        setForm({
          fullName: defaultAddress.fullName,
          phone: defaultAddress.phone,
          address: defaultAddress.address,
        });
      }
    } catch (err) {
      console.error("Failed to load default address", err);
    }
  };

  const selected = cart.filter((item) => selectedItems.includes(item._id));
  const total = selected.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingAddress: form,
        items: selected,
        totalAmount: total,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Order placed successfully!");
      clearSelectedItems();
      router.push("/");
    } else {
      setMessage(`❌ ${data.error || "Something went wrong"}`);
    }

    setLoading(false);
  };

  if (selected.length === 0) {
    return (
      <main className="min-h-screen pt-28 px-6 text-[#3e2e2e] bg-white">
        <div className="max-w-2xl mx-auto text-center py-20 text-gray-500">
          <p>You haven’t selected any items to checkout.</p>
          <Link
            href="/cart"
            className="inline-block mt-4 bg-[#a97458] hover:bg-[#8b5a3b] text-white py-2 px-4 rounded"
          >
            Back to Cart
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 px-4 sm:px-6 bg-white text-[#3e2e2e]">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: SHIPPING FORM */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold mb-4">Informasi Pengiriman</h1>

          {message && (
            <p className="text-base font-medium text-red-500">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium mb-2">Nama Lengkap</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full border px-5 py-3 rounded text-base"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">No. Telepon</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border px-5 py-3 rounded text-base"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Alamat Lengkap</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border px-5 py-3 rounded text-base"
              />
            </div>

            {/* Product Preview Below Address */}
            <div className="pt-6 border-t mt-6">
              <h3 className="text-lg font-semibold mb-1">PARCEL</h3>
              <p className="text-sm text-gray-500 mb-4">Shipped by The Fit</p>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {selected.map((item) => (
                  <div key={item._id} className="flex-shrink-0 text-center w-36">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-36 h-44 object-cover mb-3"
                    />
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm font-semibold underline text-[#3e2e2e]">
                {selected.length} ITEM{selected.length > 1 ? "S" : ""}
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="lg:sticky lg:top-15 bg-white p-6 rounded-lg h-fit">
          <div className="bg-blue-100 text-blue-800 text-base px-4 py-3 rounded mb-6 font-medium">
            🎉 Selamat! Anda mendapatkan ongkir GRATIS.
          </div>

          {/* Total Summary */}
          <div className="text-base space-y-3 mb-8">
            <div className="flex justify-between">
              <span>Diskon</span>
              <span className="text-gray-500">–</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Jumlah Pesanan</span>
              <span className="text-lg font-bold">Rp {total.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between italic">
              <span>Biaya Pengiriman</span>
              <span className="text-gray-500">Belum dihitung</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t pt-4">
              <span>Total</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-lg text-lg font-bold tracking-wide transition ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:opacity-90"
            }`}
          >
            {loading ? "Memproses..." : "Selesaikan Pembelian"}
          </button>

          <p className="mt-4 text-xs text-gray-500 leading-relaxed">
            Dengan melanjutkan, Anda menyetujui {" "}
            <a href="#" className="underline">Syarat dan Ketentuan</a> &{" "}
            <a href="#" className="underline">Kebijakan Privasi</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
