"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getPriceSignal, seedProducts, type Product } from "../lib/marketplace";

type CartItem = { id: number; qty: number };

function readCustomProducts(): Product[] {
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
  window.dispatchEvent(new Event("cart-updated"));
}

function addToCart(productId: number) {
  const cart = getCart();
  const found = cart.find((item) => item.id === productId);
  if (found) found.qty += 1;
  else cart.push({ id: productId, qty: 1 });
  saveCart(cart);
}

export default function Home() {
  const router = useRouter();
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const products = useMemo(() => [...seedProducts, ...customProducts], [customProducts]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const categoryOk = selectedCategory === "All" || p.category === selectedCategory;
      const searchOk =
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.country.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryOk && searchOk && p.status === "Live";
    });
  }, [products, selectedCategory, searchTerm]);

  useEffect(() => {
    setCustomProducts(readCustomProducts());
    const updateCart = () => setCartCount(getCart().reduce((sum, item) => sum + item.qty, 0));
    updateCart();
    window.addEventListener("cart-updated", updateCart);
    return () => window.removeEventListener("cart-updated", updateCart);
  }, []);

  function buyNow(product: Product) {
    addToCart(product.id);
    const user = localStorage.getItem("nrdealhub_user");
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 lg:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-600 text-2xl text-green-600">
              🏷
            </div>
            <h1 className="text-2xl font-black">
              NR<span className="text-green-600">DealHub</span>
            </h1>
          </Link>

          <nav className="hidden items-center gap-7 font-bold text-slate-700 lg:flex">
            <Link href="/">Home</Link>
            <Link href="/buyer">Buyer</Link>
            <Link href="/seller">Seller</Link>
            <Link href="/deals">Deals</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/login">Login</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/seller" className="rounded-xl bg-slate-900 px-4 py-3 font-black text-white">
              Sell Product
            </Link>
            <Link href="/cart" className="relative text-3xl">
              🛒
              <span className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-black text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid gap-8 rounded-[36px] bg-gradient-to-br from-green-50 via-white to-slate-50 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-green-100 px-4 py-2 font-black text-green-700">
              Global Buy Sell Marketplace
            </p>
            <h2 className="text-4xl font-black leading-tight sm:text-6xl">
              Buy Low, Sell High — Client Panel সহ Marketplace
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Buyer product কিনবে, Seller product sell করবে। দাম কম থাকলে Buy Suggestion, দাম বেশি হলে Sell Suggestion দেখাবে। সব কাজ আপনার site-এর ভিতরে।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/buyer" className="rounded-2xl bg-green-600 px-7 py-4 font-black text-white shadow-lg shadow-green-100">
                Buyer Dashboard
              </Link>
              <Link href="/seller" className="rounded-2xl border border-green-600 px-7 py-4 font-black text-green-700">
                Seller Dashboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className="overflow-hidden rounded-3xl bg-white p-3 shadow">
                <img src={item.image} alt={item.title} className="h-32 w-full rounded-2xl object-cover" />
                <p className="mt-2 text-sm font-black">{item.title}</p>
                <p className="text-xs font-bold text-green-600">৳{item.currentPrice}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-6">
        <div className="mb-8 grid gap-4 rounded-3xl bg-slate-50 p-5 lg:grid-cols-[1fr_auto]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search global product, brand, country..."
            className="rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-green-600"
          />
          <Link href="/seller" className="rounded-2xl bg-green-600 px-7 py-4 text-center font-black text-white">
            Add Sell Product
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-3 font-black ${
                selectedCategory === category ? "bg-green-600 text-white" : "bg-green-50 text-green-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-4xl font-black">All Buy / Sell Products</h2>
          <p className="mt-3 text-slate-500">
            Showing <b>{filteredProducts.length}</b> products · Filter: <b className="text-green-600">{selectedCategory}</b>
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => {
            const signal = getPriceSignal(product);
            return (
              <div key={product.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-500 hover:shadow-xl">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden rounded-3xl">
                    <img src={product.image} alt={product.title} className="h-48 w-full object-cover transition duration-500 group-hover:scale-110" />
                    <span className="absolute left-4 top-4 rounded-full bg-green-600 px-4 py-2 text-xs font-black text-white">
                      {signal.label}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-black">{product.title}</h3>
                </Link>

                <p className="mt-1 text-slate-500">{product.brand} · {product.country}</p>
                <p className="mt-3 text-3xl font-black text-green-600">৳{product.currentPrice}</p>
                <p className="text-sm text-slate-400 line-through">৳{product.oldPrice}</p>
                <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{signal.message}</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button onClick={() => addToCart(product.id)} className="rounded-2xl border border-green-600 py-3 font-black text-green-700">
                    Add Cart
                  </button>
                  <button onClick={() => buyNow(product)} className="rounded-2xl bg-green-600 py-3 font-black text-white">
                    Buy
                  </button>
                </div>

                <Link href="/seller" className="mt-3 block rounded-2xl bg-slate-900 py-3 text-center font-black text-white">
                  Sell Similar
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
