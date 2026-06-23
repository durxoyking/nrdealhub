"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPriceSignal, seedProducts, type Product } from "../../lib/marketplace";

function readSellerProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem("nrdealhub_seller_products") || "[]");
  } catch {
    return [];
  }
}

export default function BuyerPage() {
  const [products, setProducts] = useState<Product[]>(seedProducts);

  useEffect(() => {
    setProducts([...seedProducts, ...readSellerProducts()]);
  }, []);

  const lowPriceProducts = products.filter((p) => getPriceSignal(p).type === "buy");

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black">NR<span className="text-green-600">DealHub</span></Link>
          <Link href="/seller" className="rounded-xl bg-slate-900 px-5 py-3 font-black text-white">Seller Panel</Link>
        </div>

        <h1 className="text-4xl font-black">Buyer Dashboard</h1>
        <p className="mt-3 text-slate-600">যে product-এর দাম কম, এখানে Buy Suggestion হিসেবে দেখাবে।</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lowPriceProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <img src={product.image} alt={product.title} className="h-44 w-full rounded-2xl object-cover" />
              <h3 className="mt-4 text-xl font-black">{product.title}</h3>
              <p className="mt-2 text-3xl font-black text-green-600">৳{product.currentPrice}</p>
              <p className="mt-2 rounded-xl bg-white p-3 text-sm font-bold text-green-700">Low Price — Buy Now</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
