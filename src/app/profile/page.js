"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/auth/useUser";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function ProfilePage() {
  const user = useUser();
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    label: "",
    fullName: "",
    phone: "",
    address: "",
    isDefault: false,
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    const res = await fetch("/api/address");
    const data = await res.json();
    setAddresses(data);

    // 🔄 Prefill form with default address
    const defaultAddr = data.find((a) => a.isDefault);
    if (defaultAddr && !editing) {
      setForm({ ...defaultAddr });
    }
  };

  useEffect(() => {
    if (user === undefined) fetchUser();
    if (user) fetchAddresses();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editing ? "PUT" : "POST";
    await fetch("/api/address", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ _id: null, label: "", fullName: "", phone: "", address: "", isDefault: false });
    setEditing(false);
    fetchAddresses();
    setLoading(false);
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditing(true);
  };

  const handleDelete = async (_id) => {
    await fetch("/api/address", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });
    fetchAddresses();
  };

  return (
    <main className="min-h-screen pt-28 px-6 bg-white text-[#3e2e2e]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hello, {user?.name || "User"}</h1>
        <h2 className="text-xl font-semibold mb-4">Manage Your Addresses</h2>

        {/* Address Form */}
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="label" value={form.label} onChange={handleChange} placeholder="Label (Home, Work)" required className="border px-4 py-2 rounded" />
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required className="border px-4 py-2 rounded" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required className="border px-4 py-2 rounded" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Full Address" required className="border px-4 py-2 rounded col-span-2" />
          </div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            Set as default
          </label>
          <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded">
            {editing ? "Update" : "Add"} Address
          </button>
        </form>

        {/* Address List */}
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{addr.label} {addr.isDefault && <span className="text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded ml-2">Default</span>}</h3>
                  <p>{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.address}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(addr)} className="text-sm underline text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(addr._id)} className="text-sm underline text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
