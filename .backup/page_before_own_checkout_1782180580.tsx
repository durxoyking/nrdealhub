"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  title: string;
  category: string;
  brand: string;
  image: string;
  rating: number;
  reviews: number;
  cps: string;
  discount: string;
  affiliateLink: string;
};

const products: Product[] = [
  {
    id: 1,
    title: "Amazon UAE Deal",
    category: "Electronics",
    brand: "Amazon",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 128,
    cps: "7.20% CPS",
    discount: "-20%",
    affiliateLink: "https://www.amazon.ae/",
  },
  {
    id: 2,
    title: "Under Armour Offer",
    category: "Sports",
    brand: "Under Armour",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 96,
    cps: "6.40% CPS",
    discount: "-15%",
    affiliateLink: "https://www.amazon.ae/s?k=under+armour",
  },
  {
    id: 3,
    title: "Nike UAE Coupon",
    category: "Fashion",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 76,
    cps: "4.80% CPS",
    discount: "-10%",
    affiliateLink: "https://www.daraz.com.bd/catalog/?q=nike%20shoe",
  },
  {
    id: 4,
    title: "Kaspersky Global",
    category: "Digital Services",
    brand: "Kaspersky",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 112,
    cps: "30% CPS",
    discount: "-25%",
    affiliateLink: "https://www.kaspersky.com/",
  },
  {
    id: 5,
    title: "Noon UAE Deal",
    category: "Marketplace",
    brand: "Noon",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 144,
    cps: "5.50% CPS",
    discount: "-18%",
    affiliateLink: "https://www.noon.com/",
  },
  {
    id: 6,
    title: "AliExpress Deal",
    category: "Marketplace",
    brand: "AliExpress",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    rating: 4,
    reviews: 221,
    cps: "8.00% CPS",
    discount: "-30%",
    affiliateLink: "https://www.aliexpress.com/",
  },
  {
    id: 7,
    title: "Daraz Deal",
    category: "Marketplace",
    brand: "Daraz",
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 89,
    cps: "6.00% CPS",
    discount: "-22%",
    affiliateLink: "https://www.daraz.com.bd/",
  },
  {
    id: 8,
    title: "Hosting Deal",
    category: "Web Hosting",
    brand: "Hosting",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 64,
    cps: "45% CPS",
    discount: "-50%",
    affiliateLink: "https://www.hostinger.com/",
  },
  {
    id: 9,
    title: "VPN Deal",
    category: "Digital Services",
    brand: "VPN",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
    rating: 4,
    reviews: 58,
    cps: "35% CPS",
    discount: "-40%",
    affiliateLink: "https://nordvpn.com/",
  },
  {
    id: 10,
    title: "Mobile Accessories Deal",
    category: "Electronics",
    brand: "Accessories",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 172,
    cps: "9.20% CPS",
    discount: "-28%",
    affiliateLink: "https://www.amazon.com/",
  },
  {
    id: 11,
    title: "Fashion Coupon",
    category: "Fashion",
    brand: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 103,
    cps: "7.50% CPS",
    discount: "-35%",
    affiliateLink: "https://www.daraz.com.bd/catalog/?q=fashion",
  },
  {
    id: 12,
    title: "Electronics Coupon",
    category: "Electronics",
    brand: "Electronics",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 190,
    cps: "10% CPS",
    discount: "-32%",
    affiliateLink: "https://www.daraz.com.bd/catalog/?q=electronics",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);

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

  function getDeal(product: Product) {
    window.open(product.affiliateLink, "_blank", "noopener,noreferrer");
  }

  function viewAll() {
    setSelectedCategory("All");
    setSearchTerm("");
    setDropdownOpen(false);
    document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 lg:px-6">
          <a href="#" onClick={viewAll} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-600 text-2xl text-green-600">
              🏷
            </div>
            <h1 className="text-2xl font-black">
              NR<span className="text-green-600">DealHub</span>
            </h1>
          </a>

          <nav className="hidden items-center gap-8 font-bold text-slate-700 lg:flex">
            <button onClick={viewAll} className="cursor-pointer text-green-600">Home</button>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="cursor-pointer"
              >
                Categories⌄
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-9 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
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

            <a href="/brands">Brands</a>
            <a href="/deals">Deals</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="cursor-pointer text-3xl">⌕</button>
            <button onClick={() => setLoginOpen(true)} className="cursor-pointer text-2xl">♡</button>
            <button onClick={() => setCartCount(cartCount + 1)} className="relative cursor-pointer text-3xl">
              🛒
              <span className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-black text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid gap-8 rounded-[36px] bg-gradient-to-br from-green-50 via-white to-slate-50 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-green-100 px-4 py-2 font-black text-green-700">
              Best Affiliate Deals Platform
            </p>
            <h2 className="text-4xl font-black leading-tight sm:text-6xl">
              Find Best Deals, Coupons & CPS Offers
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              NRDealHub এ Amazon, Nike, Noon, Daraz, Hosting, VPN, Fashion, Electronics সহ সব deals এক জায়গায় দেখুন।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={viewAll} className="rounded-2xl bg-green-600 px-7 py-4 font-black text-white shadow-lg shadow-green-100">
                View All Deals
              </button>
              <button onClick={() => setSearchOpen(true)} className="rounded-2xl border border-green-600 px-7 py-4 font-black text-green-700">
                Search Deals
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((item) => (
              <div key={item.id} className="overflow-hidden rounded-3xl bg-white p-3 shadow">
                <img src={item.image} alt={item.title} className="h-32 w-full rounded-2xl object-cover" />
                <p className="mt-2 text-sm font-black">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="deals" className="mx-auto max-w-7xl px-4 pb-20 lg:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-black">Best Earning Deals</h2>
            <p className="mt-3 text-lg text-slate-500">
              Filter: <span className="font-black text-green-600">{selectedCategory}</span> · Showing{" "}
              <span className="font-black">{filteredProducts.length}</span> products
            </p>
          </div>

          <button
            onClick={viewAll}
            className="rounded-2xl border border-green-600 px-7 py-4 font-black text-green-700 hover:bg-green-600 hover:text-white"
          >
            View All →
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-3 font-black transition ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-500 hover:shadow-xl"
            >
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 rounded-full bg-green-600 px-4 py-2 text-sm font-black text-white">
                  {product.discount}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-black">{product.title}</h3>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-slate-500">({product.reviews})</span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black">{product.cps}</p>
                  <p className="text-slate-500">{product.category}</p>
                </div>

                <button
                  onClick={() => setCartCount(cartCount + 1)}
                  className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-green-50 text-2xl text-green-700 hover:bg-green-600 hover:text-white"
                >
                  🛒
                </button>
              </div>

              <button
                onClick={() => getDeal(product)}
                className="mt-6 w-full cursor-pointer rounded-2xl bg-green-600 py-4 font-black text-white hover:bg-green-700"
              >
                Get Deal
              </button>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-3xl bg-slate-50 p-10 text-center">
            <h3 className="text-2xl font-black">No product found</h3>
            <button onClick={viewAll} className="mt-4 rounded-xl bg-green-600 px-6 py-3 font-black text-white">
              Show All Products
            </button>
          </div>
        )}
      </section>

      <footer className="bg-slate-950 py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-2xl font-black">NRDealHub</h2>
          <p className="mt-3 text-slate-400">Best deals, coupons and affiliate offers platform.</p>
        </div>
      </footer>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-black">Search Deals</h3>
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

      {loginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-black">Login</h3>
              <button onClick={() => setLoginOpen(false)} className="rounded-full bg-slate-100 px-4 py-2 font-black">✕</button>
            </div>
            <input placeholder="Email" className="mb-3 w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-green-600" />
            <input placeholder="Password" type="password" className="mb-3 w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-green-600" />
            <button onClick={() => setLoginOpen(false)} className="w-full rounded-2xl bg-green-600 py-4 font-black text-white">
              Login Now
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
