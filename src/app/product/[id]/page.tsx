"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPriceSignal, getProductById, type Product } from "../../../lib/marketplace";

type CartItem = { id: number; qty: number };

function readSellerProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem("nrdealhub_seller_products") || "[]");
  } catch {
    return [];
  }
}

function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem("nrdealhub_cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem("nrdealhub_cart", JSON.stringify(cart));
}

function addToCart(productId: number) {
  const cart = getCart();
  const found = cart.find((item) => item.id === productId);
  if (found) found.qty += 1;
  else cart.push({ id: productId, qty: 1 });
  saveCart(cart);
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const rawId = Array.isArray(params.id) ? params.id[0] : String(params.id);
    setProduct(getProductById(rawId, readSellerProducts()) || null);
  }, [params.id]);

  if (!product) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-black">Product not found</h1>
        <Link href="/" className="mt-5 inline-flex rounded-xl bg-green-600 px-5 py-3 font-black text-white">Back Home</Link>
      </main>
    );
  }

  const signal = getPriceSignal(product);

  function buyNow() {
    addToCart(product!.id);
    const user = localStorage.getItem("nrdealhub_user");
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-2xl font-black">NR<span className="text-green-600">DealHub</span></Link>
          <Link href="/cart" className="rounded-xl bg-green-600 px-5 py-3 font-black text-white">Cart</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2 lg:px-6">
        <img src={product.image} alt={product.title} className="h-[520px] w-full rounded-[32px] object-cover" />

        <div>
          <p className="mb-3 inline-flex rounded-full bg-green-100 px-4 py-2 font-black text-green-700">{product.category}</p>
          <h1 className="text-4xl font-black lg:text-5xl">{product.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{product.description}</p>

          <div className="mt-6 rounded-3xl bg-slate-50 p-6">
            <p className="text-4xl font-black text-green-600">৳{product.currentPrice}</p>
            <p className="mt-1 text-lg text-slate-400 line-through">৳{product.oldPrice}</p>
            <p className="mt-3 font-black">Low Buy Price: ৳{product.lowBuyPrice}</p>
            <p className="font-black">Target Sell Price: ৳{product.targetSellPrice}</p>
          </div>

          <div className="mt-6 rounded-3xl bg-green-50 p-6">
            <h2 className="text-2xl font-black text-green-700">{signal.label}</h2>
            <p className="mt-2 text-slate-700">{signal.message}</p>
          </div>

          <ul className="mt-6 space-y-2 text-slate-600">
            {product.features.map((feature) => <li key={feature}>✅ {feature}</li>)}
          </ul>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <button onClick={() => addToCart(product.id)} className="rounded-2xl border border-green-600 py-4 font-black text-green-700">Add Cart</button>
            <button onClick={buyNow} className="rounded-2xl bg-green-600 py-4 font-black text-white">Buy Now</button>
            <Link href="/seller" className="rounded-2xl bg-slate-900 py-4 text-center font-black text-white">Sell Similar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
