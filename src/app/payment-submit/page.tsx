"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, CheckCircle2, CreditCard, Send, Tag } from "lucide-react";
import { db, firebaseConfigMissing } from "@/lib/firebase";

const bkashNumber = process.env.NEXT_PUBLIC_BKASH_NUMBER || "01715183396";

export default function PaymentSubmitPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (firebaseConfigMissing) {
      setError("Firebase config missing. Please check .env.local file.");
      return;
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "paymentRequests"), {
        name,
        contact,
        amount: numericAmount,
        transactionId,
        note,
        method: "bkash",
        receiveNumber: bkashNumber,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setName("");
      setContact("");
      setAmount("");
      setTransactionId("");
      setNote("");
      setSuccess("Payment information submitted successfully. Admin will verify it soon.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment submit failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-[#eef8f0] to-white px-4 py-10 text-[#14202a]">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 font-bold text-[#2f9632]">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="rounded-[2rem] border border-[#e6eee8] bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#2f9632] bg-[#eef8f0] text-[#2f9632]">
              <Tag size={26} />
            </div>
            <h1 className="text-3xl font-black">Submit Payment Info</h1>
            <p className="mt-2 text-[#5f6b76]">
              Send money to the bKash number below, then submit your transaction ID.
            </p>
          </div>

          <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#0f5f2a] to-[#2f9632] p-6 text-white">
            <div className="flex items-center gap-3">
              <CreditCard size={28} />
              <div>
                <p className="text-sm opacity-90">bKash Receive Account</p>
                <h2 className="text-3xl font-black">{bkashNumber}</h2>
              </div>
            </div>
          </div>

          {success && (
            <div className="mb-5 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
              <CheckCircle2 size={20} />
              {success}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none focus:border-[#2f9632]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Email or Phone</label>
                <input
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none focus:border-[#2f9632]"
                  placeholder="Email or phone"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">Amount</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none focus:border-[#2f9632]"
                  placeholder="Example: 500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">bKash Transaction ID</label>
                <input
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none focus:border-[#2f9632]"
                  placeholder="Example: 9ABC123XYZ"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-28 w-full rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none focus:border-[#2f9632]"
                placeholder="Optional note"
              />
            </div>

            <button
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f9632] px-6 py-4 font-black text-white shadow-lg shadow-green-200 transition hover:bg-[#0f5f2a] disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Payment"}
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
