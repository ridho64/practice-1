"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import Link from "next/link";
import { useUser } from "@/lib/auth/useUser";

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    selectedItems,
    toggleSelectItem,
    selectAll,
    clearSelectedItems,
  } = useCartStore();

  const user = useUser();

  useEffect(() => {
    if (user !== undefined) {
      loadCart(user);
    }
  }, [user]);

  const total = cart
    .filter((item) => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen pt-28 px-4 sm:px-6 text-[#3e2e2e] bg-white">
      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
        <div className="lg:col-span-2 flex flex-col gap-8 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto pr-0 lg:pr-[12px] custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-gray-500">
              <p>cart is empty.</p>
              <Link href="/products" className="underline text-[#a97458]">Shopping Now</Link>
            </div>
          ) : (
            <>
              <div className="sticky top-0 z-10 bg-white py-4  px-2 sm:px-0">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight uppercase">shopping cart</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                  <button onClick={selectAll} className="underline hover:text-black">Select All</button>
                  <button onClick={clearSelectedItems} className="underline hover:text-black">Clear Selection</button>
                  <button onClick={clearCart} className="underline hover:text-black">Clear Cart</button>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                {cart.map((item) => (
                  <div
                    key={`${item._id}-${item.size || "nosize"}`}
                    className="flex items-start gap-4 border-b pb-6"
                  >
                    {/* Checkbox + Image */}
                    <div className="flex-shrink-0 flex flex-col items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleSelectItem(item._id)}
                        className="mt-1  w-4 h-4"
                       
                      />
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gray-100 rounded-md border flex items-center justify-center text-sm text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 w-full space-y-1 text-sm">
                      <Link href={`/products/${item.slug}`} className="text-base font-semibold uppercase hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-gray-600">Color: <span className="capitalize">{item.color || "default"}</span></p>
                      {item.size && <p className="text-gray-600">Ukuran: {item.size}</p>}
                      <p className="text-gray-700 font-medium mt-2">
                        Total: Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity({ productId: item._id, size: item.size, color: item.color, quantity: item.quantity - 1 }, user)}
                          className="w-8 h-8 border text-lg font-bold hover:bg-gray-100"
                        >−</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity({ productId: item._id, size: item.size, color: item.color, quantity: item.quantity + 1 }, user)}
                          className="w-8 h-8 border text-lg font-bold hover:bg-gray-100"
                        >+</button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart({ productId: item._id, size: item.size, color: item.color }, user)}
                      className="text-gray-400 hover:text-red-500 transition ml-auto"
                      title="Remove from cart"
                    >🗑️</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <>
            {/* Desktop */}
            <div className="hidden lg:block lg:sticky lg:top-28 w-full">
              <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-sm">
                {selectedItems.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="inline-flex items-center gap-2 bg-blue-500 text-white text-sm px-3 py-2 rounded">
                        🛈 Selected items will be checked out.
                      </span>
                    </p>

                    <div className="mt-6 text-sm space-y-4">
                      <div className="flex justify-between">
                        <span>Discount</span>
                        <span className="text-gray-500">–</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Order</span>
                        <span>Rp {total.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-4">
                        <span>Total</span>
                        <span>Rp {total.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">Select items to see total cost.</p>
                )}

                <Link
                  href={selectedItems.length > 0 ? "/checkout" : "#"}
                  className={`block mt-6 w-full py-3 rounded-lg font-semibold tracking-wide text-center transition ${
                    selectedItems.length === 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none"
                      : "bg-black text-white hover:opacity-90"
                  }`}
                >
                  Checkout
                </Link>
              </div>
            </div>

            {/* Mobile */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden z-20 border-t bg-white p-4 flex items-center justify-between shadow-md">
              <div className="flex flex-col text-sm">
                <span className="text-gray-500">Total</span>
                <span className="text-lg font-bold text-black">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>
              <Link
                href={selectedItems.length > 0 ? "/checkout" : "#"}
                className={`px-6 py-3 rounded-lg font-semibold tracking-wide transition ${
                  selectedItems.length === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-black text-white hover:opacity-90"
                }`}
              >
                Checkout ({selectedItems.length})
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
