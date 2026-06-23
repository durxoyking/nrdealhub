"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getProductById, type Product } from "../../lib/marketplace";

type CartItem = { id: number; qty: number };

function readCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem("nrdealhub_cart") || "[]");
  } catch {
    return [];
  }
}

function readSellerProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem("nrdealhub_seller_products") || "[]");
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [extra, setExtra] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "", payment: "Cash on Delivery" });

  useEffect(() => {
    const user = localStorage.getItem("nrdealhub_user");
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    setCart(readCart());
    setExtra(readSellerProducts());
  }, [router]);

  const rows = useMemo(() => cart.map((item) => ({ item, product: getProductById(item.id, extra) })).filter((row) => row.product), [cart, extra]);
  const total = rows.reduce((sum, row) => sum + (row.product?.currentPrice || 0) * row.item.qty, 0);

  function confirmOrder() {
    if (!form.name || !form.phone || !form.address) {
      alert("Name, phone and address দিন");
      return;
    }

    localStorage.setItem("nrdealhub_last_order", JSON.stringify({
      id: "NRD-" + Date.now(),
      customer: form,
      total,
      date: new Date().toLocaleString(),
    }));
    localStorage.removeItem("nrdealhub_cart");
    router.push("/success");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black">NR<span className="text-green-600">DealHub</span></Link>
          <Link href="/cart" className="rounded-xl border border-green-600 px-5 py-3 font-black text-green-700">Back Cart</Link>
        </div>

        <h1 className="text-4xl font-black">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-2xl font-black">Customer Information</h2>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="mt-5 w-full rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number" className="mt-3 w-full rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Delivery Address" className="mt-3 h-32 w-full rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
            <select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })} className="mt-3 w-full rounded-2xl border px-5 py-4 outline-none">
              <option>Cash on Delivery</option>
              <option>Bkash Payment</option>
              <option>Nagad Payment</option>
            </select>
          </div>

          <div className="h-fit rounded-3xl bg-slate-50 p-6">
            <h2 className="text-2xl font-black">Order Summary</h2>
            <p className="mt-5 text-3xl font-black text-green-600">৳{total}</p>
            <button onClick={confirmOrder} className="mt-6 w-full rounded-2xl bg-green-600 py-4 font-black text-white">Confirm Order</button>
          </div>
        </div>
      </div>
    </main>
  );
}
