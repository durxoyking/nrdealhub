/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Headphones,
  Menu,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  User,
  X,
  Zap,
  Gift,
  Percent,
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, firebaseConfigMissing } from "@/lib/firebase";

const menus = [
  { name: "Home", target: "home" },
  { name: "Categories", target: "categories" },
  { name: "Brands", target: "brands" },
  { name: "Deals", target: "deals" },
  { name: "About Us", target: "about" },
  { name: "Contact", target: "contact" },
];

const categories = [
  {
    name: "Fashion",
    count: "18 Deals",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Electronics",
    count: "24 Deals",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Travel",
    count: "12 Deals",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Health",
    count: "10 Deals",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Sports",
    count: "8 Deals",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Digital Services",
    count: "15 Deals",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80",
  },
];

const brands = [
  {
    name: "Amazon UAE",
    commission: "7.20% CPS",
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Nike UAE",
    commission: "4.80% CPS",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Travel Deals",
    commission: "4.00% CPS",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Kaspersky Global",
    commission: "30% CPS",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&q=80",
  },
];

const deals = [
  {
    title: "Amazon UAE Deal",
    badge: "-20%",
    commission: "7.20% CPS",
    rating: "128",
    category: "Electronics",
    url: "https://www.amazon.ae/",
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Under Armour Offer",
    badge: "-15%",
    commission: "6.40% CPS",
    rating: "96",
    category: "Sports",
    url: "https://www.underarmour.com/",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Nike UAE Coupon",
    badge: "-10%",
    commission: "4.80% CPS",
    rating: "76",
    category: "Fashion",
    url: "https://www.nike.com/ae/",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Kaspersky Global",
    badge: "-25%",
    commission: "30% CPS",
    rating: "112",
    category: "Digital Services",
    url: "https://www.kaspersky.com/",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=700&q=80",
  },
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const scrollToSection = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openDeal = async (url: string, dealTitle = "Affiliate Deal", category = "General") => {
    try {
      if (!firebaseConfigMissing) {
        await addDoc(collection(db, "affiliateClicks"), {
          dealTitle,
          dealUrl: url,
          category,
          clickedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Click tracking failed:", error);
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchCategory = selectedCategory === "All" || deal.category === selectedCategory;
      const matchSearch =
        searchText.trim() === "" ||
        deal.title.toLowerCase().includes(searchText.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchText.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchText]);

  return (
    <main id="home" className="min-h-screen bg-white text-[#14202a]">
      <div className="bg-gradient-to-r from-[#0b2414] via-[#10391f] to-[#0b2414] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-green-300" />
            <span>Free Delivery On All Orders</span>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Percent size={16} className="text-green-300" />
            <span>Up to 40% OFF on Selected Deals</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones size={16} className="text-green-300" />
            <span>Support: 24/7</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#e6eee8] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <button onClick={() => scrollToSection("home")} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#2f9632] bg-[#eef8f0] text-[#2f9632]">
              <Tag size={22} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              NR<span className="text-[#2f9632]">DealHub</span>
            </h1>
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {menus.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.target)}
                className={`flex items-center gap-1 text-sm font-semibold transition hover:text-[#2f9632] ${
                  item.name === "Home" ? "text-[#2f9632]" : "text-[#14202a]"
                }`}
              >
                {item.name}
                {item.name === "Categories" && <ChevronDown size={15} />}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <button onClick={() => setSearchOpen(!searchOpen)} className="hover:text-[#2f9632]">
              <Search size={24} />
            </button>
            <button onClick={() => (window.location.href = "/login")} className="hover:text-[#2f9632]">
              <User size={24} />
            </button>
            <button onClick={() => scrollToSection("deals")} className="relative hover:text-[#2f9632]">
              <ShoppingCart size={25} />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2f9632] text-xs font-bold text-white">
                0
              </span>
            </button>
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden">
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {searchOpen && (
          <div className="border-t border-[#e6eee8] bg-white px-4 py-4">
            <div className="mx-auto flex max-w-3xl overflow-hidden rounded-2xl border border-[#e6eee8] bg-[#f7fbf8]">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search deals, brands, categories..."
                className="w-full bg-transparent px-5 py-4 outline-none"
              />
              <button onClick={() => scrollToSection("deals")} className="bg-[#2f9632] px-6 text-white">
                <Search size={20} />
              </button>
            </div>
          </div>
        )}

        {open && (
          <div className="border-t border-[#e6eee8] bg-white px-4 py-5 lg:hidden">
            <div className="flex flex-col gap-4">
              {menus.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.target)}
                  className="text-left font-semibold hover:text-[#2f9632]"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <section className="overflow-hidden bg-gradient-to-br from-white via-[#eef8f0] to-white">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <p className="mb-4 font-bold text-[#2f9632]">Smart Deals, Smarter Savings</p>
            <h2 className="max-w-2xl text-4xl font-black leading-tight md:text-6xl">
              Upgrade Your Shopping with{" "}
              <span className="text-[#2f9632]">Smart Affiliate Deals</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5f6b76]">
              Discover verified stores, exclusive offers, coupons, and high-value deals from trusted brands worldwide.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("deals")}
                className="inline-flex items-center gap-3 rounded-xl bg-[#2f9632] px-8 py-4 font-bold text-white shadow-lg shadow-green-200 transition hover:bg-[#0f5f2a]"
              >
                Shop Now <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollToSection("categories")}
                className="inline-flex items-center gap-3 rounded-xl border border-[#2f9632] bg-white px-8 py-4 font-bold transition hover:bg-[#eef8f0]"
              >
                Explore Categories
              </button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: BadgeCheck, title: "Verified Deals", text: "Trusted offers" },
                { icon: Zap, title: "Easy Access", text: "One click deals" },
                { icon: ShieldCheck, title: "Secure Redirect", text: "100% protected" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dff3e2] text-[#2f9632]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{item.title}</h4>
                      <p className="text-xs text-[#5f6b76]">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-green-200 blur-3xl"></div>
            <div className="absolute -right-8 bottom-10 h-40 w-40 rounded-full bg-green-300 blur-3xl"></div>
            <div className="relative overflow-hidden rounded-[2rem] border border-[#e6eee8] bg-white p-4 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1100&q=80"
                alt="Affiliate shopping deals"
                className="h-[430px] w-full rounded-[1.5rem] object-cover"
              />
              <div className="absolute bottom-8 left-8 rounded-2xl bg-white/90 p-5 shadow-xl backdrop-blur">
                <p className="text-sm font-bold text-[#2f9632]">Today’s Best Commission</p>
                <h3 className="mt-1 text-3xl font-black">30% CPS</h3>
              </div>
              <div className="absolute right-8 top-8 rounded-full bg-[#2f9632] px-5 py-3 font-black text-white shadow-xl">
                -40% OFF
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="rounded-t-[2rem] bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <p className="font-bold text-[#2f9632]">Browse By Category</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Popular Categories</h2>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setSelectedCategory(item.name);
                  scrollToSection("deals");
                }}
                className={`group rounded-3xl border bg-white p-4 text-center shadow-[0_20px_50px_rgba(15,95,42,0.08)] transition hover:-translate-y-2 hover:border-[#2f9632] ${
                  selectedCategory === item.name ? "border-[#2f9632]" : "border-[#e6eee8]"
                }`}
              >
                <div className="mx-auto mb-5 h-28 w-full overflow-hidden rounded-3xl bg-[#f7fbf8]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition group-hover:scale-110" />
                </div>
                <h3 className="font-black">{item.name}</h3>
                <p className="mt-2 text-sm text-[#5f6b76]">{item.count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="brands" className="bg-[#f7fbf8] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#2f9632]">Trusted Brands</p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">Popular Brands</h2>
            </div>
            <button onClick={() => scrollToSection("deals")} className="hidden rounded-xl border border-[#2f9632] px-6 py-3 font-bold text-[#2f9632] hover:bg-[#2f9632] hover:text-white md:block">
              View Deals
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => {
                  setSearchText(brand.name.split(" ")[0]);
                  scrollToSection("deals");
                }}
                className="overflow-hidden rounded-3xl border border-[#e6eee8] bg-white text-left shadow-[0_20px_50px_rgba(15,95,42,0.08)] transition hover:-translate-y-2 hover:border-[#2f9632]"
              >
                <img src={brand.image} alt={brand.name} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-black">{brand.name}</h3>
                  <p className="mt-2 font-bold text-[#2f9632]">{brand.commission}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="deals" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black md:text-4xl">Best Earning Deals</h2>
              <p className="mt-2 text-[#5f6b76]">
                Filter: <span className="font-bold text-[#2f9632]">{selectedCategory}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchText("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2f9632] px-6 py-3 font-bold text-[#2f9632] transition hover:bg-[#2f9632] hover:text-white"
            >
              View All <ArrowRight size={18} />
            </button>
          </div>

          {filteredDeals.length === 0 ? (
            <div className="rounded-3xl border border-[#e6eee8] bg-[#f7fbf8] p-10 text-center">
              <h3 className="text-2xl font-black">No deal found</h3>
              <p className="mt-2 text-[#5f6b76]">Click View All to see all deals.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {filteredDeals.map((deal) => (
                <div
                  key={deal.title}
                  className="group relative overflow-hidden rounded-3xl border border-[#e6eee8] bg-white p-5 shadow-[0_20px_50px_rgba(15,95,42,0.08)] transition hover:-translate-y-2 hover:border-[#2f9632]"
                >
                  <span className="absolute left-8 top-8 z-10 rounded-full bg-[#2f9632] px-3 py-1 text-xs font-black text-white">
                    {deal.badge}
                  </span>

                  <div className="h-44 overflow-hidden rounded-3xl bg-[#f7fbf8]">
                    <img src={deal.image} alt={deal.title} className="h-full w-full object-cover transition group-hover:scale-110" />
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-black">{deal.title}</h3>

                    <div className="mt-3 flex items-center gap-1 text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} fill="currentColor" />
                      ))}
                      <span className="ml-2 text-sm text-[#5f6b76]">({deal.rating})</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xl font-black">{deal.commission}</p>
                        <p className="text-sm text-[#5f6b76]">{deal.category}</p>
                      </div>
                      <button
                        onClick={() => openDeal(deal.url, deal.title, deal.category)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef8f0] text-[#2f9632] transition group-hover:bg-[#2f9632] group-hover:text-white"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>

                    <button
                      onClick={() => openDeal(deal.url, deal.title, deal.category)}
                      className="mt-5 w-full rounded-xl border border-[#2f9632] px-5 py-3 font-bold text-[#2f9632] transition hover:bg-[#2f9632] hover:text-white"
                    >
                      Get Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f5f2a] via-[#2f9632] to-[#5acb63] p-8 text-white shadow-2xl md:p-12">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1000&q=80"
              alt="Shopping offer"
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">
              <div className="flex items-center gap-6">
                <div className="hidden h-24 w-24 items-center justify-center rounded-full bg-white text-[#2f9632] md:flex">
                  <Percent size={52} />
                </div>
                <div>
                  <p className="text-lg font-bold">Limited Time Offer</p>
                  <h2 className="mt-2 text-4xl font-black md:text-5xl">Up to 40% OFF</h2>
                  <p className="mt-2 text-lg">On Selected Affiliate Deals</p>
                  <button
                    onClick={() => scrollToSection("deals")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-black text-[#14202a] transition hover:bg-[#eef8f0]"
                  >
                    Shop Deals Now <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              <div className="hidden justify-end gap-5 lg:flex">
                <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
                  <ShoppingCart size={78} />
                </div>
                <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
                  <Tag size={78} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#f7fbf8] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="font-bold text-[#2f9632]">About NRDealHub</p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">Smart Affiliate Deals Platform</h2>
          <p className="mt-5 text-lg leading-8 text-[#5f6b76]">
            NRDealHub helps users discover verified affiliate offers, coupons, brand deals, and high-value commission-based promotions from trusted online stores.
          </p>
        </div>
      </section>

      <footer id="contact" className="border-t border-[#e6eee8] bg-[#f7fbf8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-black">
              NR<span className="text-[#2f9632]">DealHub</span>
            </h2>
            <p className="mt-4 leading-7 text-[#5f6b76]">
              Your one-stop destination for verified affiliate deals, coupons, and smart savings.
            </p>
            <div className="mt-5 rounded-2xl border border-[#e6eee8] bg-white p-4 shadow-sm">
              <p className="text-sm font-bold text-[#14202a]">Payment Receive Account</p>
              <p className="mt-1 text-lg font-black text-[#2f9632]">bKash: 01715183396</p>
              <a href="/payment-submit" className="mt-3 inline-block rounded-xl bg-[#2f9632] px-4 py-2 text-sm font-bold text-white">Submit Payment Info</a>
            </div>
            <div className="mt-6 flex gap-3">
              {["f", "ig", "tw", "yt"].map((item) => (
                <button
                  key={item}
                  onClick={() => alert(`${item} social link will be added later.`)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-[#2f9632] shadow"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-black">Quick Links</h3>
            <ul className="space-y-3 text-[#5f6b76]">
              {menus.map((item) => (
                <li key={item.name}>
                  <button onClick={() => scrollToSection(item.target)} className="hover:text-[#2f9632]">
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-black">Customer Service</h3>
            <ul className="space-y-3 text-[#5f6b76]">
              {["Track Order", "Returns & Refunds", "Shipping Policy", "Privacy Policy", "Terms & Conditions"].map((item) => (
                <li key={item}>
                  <button onClick={() => alert(`${item} page will be added later.`)} className="hover:text-[#2f9632]">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-black">Newsletter</h3>
            <p className="mb-5 leading-7 text-[#5f6b76]">
              Subscribe to get the latest deals and exclusive offers.
            </p>
            <div className="flex overflow-hidden rounded-xl border border-[#e6eee8] bg-white">
              <input className="w-full px-4 py-4 outline-none" placeholder="Enter your email" />
              <button onClick={() => alert("Newsletter will be connected with Firebase later.")} className="bg-[#2f9632] px-5 text-white">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e6eee8]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-sm text-[#5f6b76] md:flex-row">
            <p>© 2026 NRDealHub. All Rights Reserved.</p>
            <div className="flex flex-wrap gap-3">
              {["VISA", "Mastercard", "PayPal", "Apple Pay"].map((item) => (
                <span key={item} className="rounded-md bg-white px-3 py-1 font-bold text-[#14202a] shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
