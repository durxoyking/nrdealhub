"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  customer: { name: string; phone: string; address: string; payment: string };
  total: number;
  date: string;
};

export default function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      setOrder(JSON.parse(localStorage.getItem("nrdealhub_last_order") || "null"));
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 py-16 text-slate-950">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-4xl text-white">✓</div>
        <h1 className="mt-6 text-4xl font-black">Buy Success!</h1>
        <p className="mt-3 text-slate-600">Order successfully submit হয়েছে। সব কাজ NRDealHub site-এর ভিতরেই complete হয়েছে।</p>

        {order && (
          <div className="mt-8 rounded-3xl bg-white p-6 text-left">
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>Name:</b> {order.customer.name}</p>
            <p><b>Phone:</b> {order.customer.phone}</p>
            <p><b>Payment:</b> {order.customer.payment}</p>
            <p><b>Total:</b> ৳{order.total}</p>
          </div>
        )}

        <Link href="/" className="mt-8 inline-flex rounded-2xl bg-green-600 px-8 py-4 font-black text-white">Back Home</Link>
      </div>
    </main>
  );
}
