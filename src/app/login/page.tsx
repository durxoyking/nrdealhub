"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff, Lock, Mail, Tag } from "lucide-react";
import { auth, firebaseConfigMissing } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (firebaseConfigMissing) {
      setError("Firebase config missing. Please add your Firebase keys in .env.local file.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#eef8f0] to-white px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-[#e6eee8] bg-white p-8 shadow-2xl">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#2f9632] bg-[#eef8f0] text-[#2f9632]">
            <Tag size={22} />
          </div>
          <h1 className="text-2xl font-black text-[#14202a]">
            NR<span className="text-[#2f9632]">DealHub</span>
          </h1>
        </Link>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-[#14202a]">Welcome Back</h2>
          <p className="mt-2 text-[#5f6b76]">Login to access your dashboard.</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#14202a]">Email Address</label>
            <div className="flex items-center rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4">
              <Mail size={20} className="text-[#2f9632]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-transparent px-3 py-4 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#14202a]">Password</label>
            <div className="flex items-center rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4">
              <Lock size={20} className="text-[#2f9632]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent px-3 py-4 outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#5f6b76]">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2f9632] px-6 py-4 font-black text-white shadow-lg shadow-green-200 transition hover:bg-[#0f5f2a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#5f6b76]">
          New user?{" "}
          <Link href="/register" className="font-bold text-[#2f9632] hover:underline">
            Create Account
          </Link>
        </p>

        <Link href="/" className="mt-5 block text-center text-sm font-bold text-[#14202a] hover:text-[#2f9632]">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
