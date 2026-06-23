"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function submit() {
    if (!email) {
      alert("Email or phone দিন");
      return;
    }

    localStorage.setItem("nrdealhub_user", JSON.stringify({ email, name: name || "Customer" }));
    const params = new URLSearchParams(window.location.search);
    router.push(params.get("redirect") || "/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white px-4 py-16 text-slate-950">
      <div className="mx-auto max-w-md rounded-[32px] bg-white p-8 shadow-xl">
        <Link href="/" className="text-2xl font-black">NR<span className="text-green-600">DealHub</span></Link>
        <h1 className="mt-8 text-4xl font-black">{mode === "login" ? "Login" : "Sign Up"}</h1>
        <p className="mt-2 text-slate-600">Buy/Sell করতে NRDealHub account দরকার। External website login লাগবে না।</p>

        <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-2">
          <button onClick={() => setMode("login")} className={`rounded-xl py-3 font-black ${mode === "login" ? "bg-green-600 text-white" : "text-slate-600"}`}>Login</button>
          <button onClick={() => setMode("signup")} className={`rounded-xl py-3 font-black ${mode === "signup" ? "bg-green-600 text-white" : "text-slate-600"}`}>Sign Up</button>
        </div>

        {mode === "signup" && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="mt-5 w-full rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email or Phone" className="mt-4 w-full rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />
        <input placeholder="Password" type="password" className="mt-4 w-full rounded-2xl border px-5 py-4 outline-none focus:border-green-600" />

        <button onClick={submit} className="mt-6 w-full rounded-2xl bg-green-600 py-4 font-black text-white">
          {mode === "login" ? "Login Now" : "Create Account"}
        </button>
      </div>
    </main>
  );
}
