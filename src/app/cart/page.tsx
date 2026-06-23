"use client";

import Link from "next/link";
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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [extra, setExtra] = useState<Product[]>([]);

  useEffect(() => {
    setCart(readCart());
    setExtra(readSellerProducts());
  }, []);

  function save(next: CartItem[]) {
    setCart(next);
    localStorage.setItem("nrdealhub_cart", JSON.stringify(next));
  }

  const rows = useMemo(() => cart.map((item) => ({ item, product: getProductById(item.id, extra) })).filter((row) => row.product), [cart, extra]);
  const total = rows.reduce((sum, row) => sum + (row.product?.currentPrice || 0) * row.item.qty, 0);

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black">NR<span className="text-green-600">DealHub</span></Link>
          <Link href="/" className="rounded-xl border border-green-600 px-5 py-3 font-black text-green-700">Continue Shopping</Link>
        </div>

        <h1 className="text-4xl font-black">My Cart</h1>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-slate-50 p-10 text-center">
            <h2 className="text-2xl font-black">Cart is empty</h2>
            <Link href="/" className="mt-5 inline-flex rounded-xl bg-green-600 px-6 py-3 font-black text-white">View Products</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {rows.map(({ item, product }) => product && (
                <div key={product.id} className="grid gap-5 rounded-3xl border border-slate-200 p-5 sm:grid-cols-[140px_1fr_auto]">
                  <img src={product.image} alt={product.title} className="h-32 w-full rounded-2xl object-cover" />
                  <div>
                    <h3 className="text-xl font-black">{product.title}</h3>
                    <p className="text-slate-500">{product.category}</p>
                    <p className="mt-2 text-2xl font-black text-green-600">৳{product.currentPrice}</p>
                    <p className="mt-2 font-bold">Qty: {item.qty}</p>
                  </div>
                  <button onClick={() => save(cart.filter((c) => c.id !== item.id))} className="h-fit rounded-xl bg-red-50 px-4 py-3 font-black text-red-600">Remove</button>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-3xl bg-slate-50 p-6">
              <h2 className="text-2xl font-black">Order Summary</h2>
              <p className="mt-4 text-slate-600">Total Items: {cart.reduce((sum, item) => sum + item.qty, 0)}</p>
              <p className="mt-3 text-3xl font-black text-green-600">৳{total}</p>
              <Link href="/checkout" className="mt-6 block rounded-2xl bg-green-600 py-4 text-center font-black text-white">Checkout</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
