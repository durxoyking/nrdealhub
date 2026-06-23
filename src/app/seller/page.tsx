"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { seedProducts, getPriceSignal, type Product } from "../../lib/marketplace";

function readSellerProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem("nrdealhub_seller_products") || "[]");
  } catch {
    return [];
  }
}

export default function SellerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    title: "",
    category: "Electronics",
    brand: "",
    country: "Bangladesh",
    currentPrice: "",
    oldPrice: "",
    lowBuyPrice: "",
    targetSellPrice: "",
    stock: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    setProducts(readSellerProducts());
  }, []);

  function save(next: Product[]) {
    setProducts(next);
    localStorage.setItem("nrdealhub_seller_products", JSON.stringify(next));
  }

  function addProduct() {
    if (!form.title || !form.currentPrice || !form.targetSellPrice) {
      alert("Title, current price, target sell price দিন");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      brand: form.brand || "Seller Brand",
      country: form.country,
      currentPrice: Number(form.currentPrice),
      oldPrice: Number(form.oldPrice || form.currentPrice),
      lowBuyPrice: Number(form.lowBuyPrice || form.currentPrice),
      targetSellPrice: Number(form.targetSellPrice),
      stock: Number(form.stock || 1),
      image: form.image || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
      rating: 5,
      reviews: 0,
      description: form.description || "Seller uploaded product for NRDealHub marketplace.",
      features: ["Seller product", "Buy sell supported", "Price alert enabled"],
      seller: "Client Seller",
      status: "Live",
    };

    save([newProduct, ...products]);
    setForm({
      title: "",
      category: "Electronics",
      brand: "",
      country: "Bangladesh",
      currentPrice: "",
      oldPrice: "",
      lowBuyPrice: "",
      targetSellPrice: "",
      stock: "",
      image: "",
      description: "",
    });
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black">NR<span className="text-green-600">DealHub</span></Link>
          <Link href="/buyer" className="rounded-xl bg-green-600 px-5 py-3 font-black text-white">Buyer Panel</Link>
        </div>

        <h1 className="text-4xl font-black">Seller Dashboard</h1>
        <p className="mt-3 text-slate-600">Client এখানে product upload করবে, price set করবে, target sell price দিলে system sell opportunity দেখাবে।</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-2xl font-black">Add Product For Sell</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product title" className="rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Brand" className="rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-2xl border px-5 py-4 outline-none">
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Gadget</option>
                <option>Digital Service</option>
                <option>Home Appliance</option>
                <option>Sports</option>
              </select>
              <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
              <input value={form.currentPrice} onChange={(e) => setForm({ ...form, currentPrice: e.target.value })} placeholder="Current price" type="number" className="rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
              <input value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="Old price" type="number" className="rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
              <input value={form.lowBuyPrice} onChange={(e) => setForm({ ...form, lowBuyPrice: e.target.value })} placeholder="Low buy price" type="number" className="rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
              <input value={form.targetSellPrice} onChange={(e) => setForm({ ...form, targetSellPrice: e.target.value })} placeholder="Target sell price" type="number" className="rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
              <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" type="number" className="rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
            </div>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" className="mt-3 h-32 w-full rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
            <button onClick={addProduct} className="mt-5 w-full rounded-2xl bg-green-600 py-4 font-black text-white">Add Product</button>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <h2 className="text-2xl font-black">Sell Opportunity</h2>
            <div className="mt-5 space-y-4">
              {[...seedProducts, ...products].slice(0, 5).map((product) => {
                const signal = getPriceSignal(product);
                return (
                  <div key={product.id} className="rounded-2xl bg-white p-4 shadow-sm">
                    <h3 className="font-black">{product.title}</h3>
                    <p className="text-sm text-slate-500">Current: ৳{product.currentPrice} · Target: ৳{product.targetSellPrice}</p>
                    <p className="mt-2 text-sm font-black text-green-600">{signal.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <h2 className="mt-12 text-3xl font-black">My Selling Products</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-3xl border border-slate-200 p-5 shadow-sm">
              <img src={product.image} alt={product.title} className="h-44 w-full rounded-2xl object-cover" />
              <h3 className="mt-4 text-xl font-black">{product.title}</h3>
              <p className="text-slate-500">{product.category}</p>
              <p className="mt-2 text-2xl font-black text-green-600">৳{product.currentPrice}</p>
              <button onClick={() => save(products.filter((p) => p.id !== product.id))} className="mt-4 w-full rounded-xl bg-red-50 py-3 font-black text-red-600">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
