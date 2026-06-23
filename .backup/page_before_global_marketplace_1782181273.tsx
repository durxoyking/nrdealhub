"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products, type Product } from "../lib/products";

type CartItem = { id: number; qty: number };

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((item) => item.category)))], []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
      const searchMatch =
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    const update = () => setCartCount(getCart().reduce((sum, item) => sum + item.qty, 0));
    update();
    window.addEventListener("cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  function viewAll() {
    setSelectedCategory("All");
    setSearchTerm("");
    setDropdownOpen(false);
    document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" });
  }

  function buyNow(product: Product) {
    const user = localStorage.getItem("nrdealhub_user");
    addToCart(product.id);
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
          <button onClick={viewAll} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-600 text-2xl text-green-600">
              🏷
            </div>
            <h1 className="text-2xl font-black">
              NR<span className="text-green-600">DealHub</span>
            </h1>
          </button>

          <nav className="hidden items-center gap-8 font-bold text-slate-700 lg:flex">
            <button onClick={viewAll} className="cursor-pointer text-green-600">Home</button>

            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="cursor-pointer">
                Categories⌄
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-9 z-50 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setDropdownOpen(false);
                      }}
                      className="block w-full cursor-pointer px-5 py-3 text-left font-bold hover:bg-green-50 hover:text-green-700"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/brands">Brands</Link>
            <Link href="/deals">Deals</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="cursor-pointer text-3xl">⌕</button>
            <Link href="/login" className="cursor-pointer text-2xl">👤</Link>
            <Link href="/cart" className="relative cursor-pointer text-3xl">
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
              Own Site Checkout System
            </p>
            <h2 className="text-4xl font-black leading-tight sm:text-6xl">
              Product Details, Cart & Buy Success — সব আপনার সাইটে
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              কোনো external website signup/login না। Customer NRDealHub-এ account করে product details দেখবে, cart করবে, checkout করবে এবং success page দেখবে।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={viewAll} className="rounded-2xl bg-green-600 px-7 py-4 font-black text-white shadow-lg shadow-green-100">
                View All Products
              </button>
              <Link href="/cart" className="rounded-2xl border border-green-600 px-7 py-4 font-black text-green-700">
                My Cart
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className="overflow-hidden rounded-3xl bg-white p-3 shadow">
                <img src={item.image} alt={item.title} className="h-32 w-full rounded-2xl object-cover" />
                <p className="mt-2 text-sm font-black">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="deals" className="mx-auto max-w-7xl px-4 pb-20 lg:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-black">All Products & Deals</h2>
            <p className="mt-3 text-lg text-slate-500">
              Filter: <span className="font-black text-green-600">{selectedCategory}</span> · Showing{" "}
              <span className="font-black">{filteredProducts.length}</span> products
            </p>
          </div>

          <button onClick={viewAll} className="rounded-2xl border border-green-600 px-7 py-4 font-black text-green-700 hover:bg-green-600 hover:text-white">
            View All →
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-3 font-black transition ${
                selectedCategory === category ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-500 hover:shadow-xl">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden rounded-3xl">
                  <img src={product.image} alt={product.title} className="h-48 w-full object-cover transition duration-500 group-hover:scale-110" />
                  <span className="absolute left-4 top-4 rounded-full bg-green-600 px-4 py-2 text-sm font-black text-white">
                    {product.discount}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black">{product.title}</h3>
              </Link>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-slate-500">({product.reviews})</span>
              </div>

              <div className="mt-5">
                <p className="text-2xl font-black">৳{product.price}</p>
                <p className="text-sm text-slate-400 line-through">৳{product.oldPrice}</p>
                <p className="text-slate-500">{product.category}</p>
                <p className="font-black text-green-600">{product.cps}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={() => addToCart(product.id)} className="cursor-pointer rounded-2xl border border-green-600 py-3 font-black text-green-700 hover:bg-green-50">
                  Add Cart
                </button>
                <button onClick={() => buyNow(product)} className="cursor-pointer rounded-2xl bg-green-600 py-3 font-black text-white hover:bg-green-700">
                  Buy Now
                </button>
              </div>

              <Link href={`/product/${product.id}`} className="mt-3 block rounded-2xl bg-slate-100 py-3 text-center font-black text-slate-800 hover:bg-slate-200">
                Product Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-slate-950 py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-2xl font-black">NRDealHub</h2>
          <p className="mt-3 text-slate-400">Own website product details, cart, checkout and success system.</p>
        </div>
      </footer>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-black">Search Products</h3>
              <button onClick={() => setSearchOpen(false)} className="rounded-full bg-slate-100 px-4 py-2 font-black">✕</button>
            </div>
            <input
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product, brand, category..."
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-green-600"
            />
            <button onClick={() => setSearchOpen(false)} className="mt-4 w-full rounded-2xl bg-green-600 py-4 font-black text-white">
              Search
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
