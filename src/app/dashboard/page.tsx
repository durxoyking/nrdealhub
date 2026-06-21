"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  DollarSign,
  LogOut,
  Mail,
  MousePointerClick,
  RefreshCcw,
  ShieldCheck,
  Store,
  Tag,
  TrendingUp,
} from "lucide-react";
import { auth, db, firebaseConfigMissing } from "@/lib/firebase";

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "durxoyking@gmail.com";
const bkashNumber = process.env.NEXT_PUBLIC_BKASH_NUMBER || "01715183396";

type Status = "pending" | "approved" | "rejected";
type IncomeSource = "affiliate" | "bkash" | "manual";

type TimestampLike = {
  toDate?: () => Date;
};

type Earning = {
  id: string;
  incomeTitle: string;
  amount: number;
  source: IncomeSource;
  status: Status;
  note?: string;
  createdAt?: TimestampLike;
};

type PaymentRequest = {
  id: string;
  name: string;
  contact: string;
  amount: number;
  transactionId: string;
  note?: string;
  status: Status;
  createdAt?: TimestampLike;
};

type AffiliateClick = {
  id: string;
  dealTitle: string;
  dealUrl: string;
  category?: string;
  clickedAt?: TimestampLike;
};

function money(amount: number) {
  return `৳ ${amount.toLocaleString("en-BD")}`;
}

function getDate(value?: TimestampLike) {
  if (value?.toDate) return value.toDate();
  return new Date();
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [clicks, setClicks] = useState<AffiliateClick[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [incomeTitle, setIncomeTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<IncomeSource>("affiliate");
  const [status, setStatus] = useState<Status>("approved");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (firebaseConfigMissing) {
      setChecking(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const loggedEmail = currentUser.email?.toLowerCase();
      const allowedEmail = adminEmail.toLowerCase();

      if (loggedEmail !== allowedEmail) {
        setAccessDenied(true);
        setUser(currentUser);
      } else {
        setUser(currentUser);
        setAccessDenied(false);
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadDashboardData = async () => {
    if (firebaseConfigMissing) return;

    try {
      setLoadingData(true);

      const earningsSnapshot = await getDocs(query(collection(db, "earnings"), orderBy("createdAt", "desc")));
      const paymentSnapshot = await getDocs(query(collection(db, "paymentRequests"), orderBy("createdAt", "desc")));
      const clickSnapshot = await getDocs(query(collection(db, "affiliateClicks"), orderBy("clickedAt", "desc")));

      setEarnings(earningsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Earning)));
      setPayments(paymentSnapshot.docs.map((item) => ({ id: item.id, ...item.data() } as PaymentRequest)));
      setClicks(clickSnapshot.docs.map((item) => ({ id: item.id, ...item.data() } as AffiliateClick)));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Dashboard data load failed.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && !accessDenied) {
      loadDashboardData();
    }
  }, [user, accessDenied]);

  const stats = useMemo(() => {
    const approvedEarnings = earnings.filter((item) => item.status === "approved");
    const approvedPayments = payments.filter((item) => item.status === "approved");

    const totalManualIncome = approvedEarnings.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalApprovedPayment = approvedPayments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalIncome = totalManualIncome + totalApprovedPayment;

    const today = new Date();
    const todayIncome =
      approvedEarnings
        .filter((item) => getDate(item.createdAt).toDateString() === today.toDateString())
        .reduce((sum, item) => sum + Number(item.amount || 0), 0) +
      approvedPayments
        .filter((item) => getDate(item.createdAt).toDateString() === today.toDateString())
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const monthIncome =
      approvedEarnings
        .filter((item) => {
          const date = getDate(item.createdAt);
          return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        })
        .reduce((sum, item) => sum + Number(item.amount || 0), 0) +
      approvedPayments
        .filter((item) => {
          const date = getDate(item.createdAt);
          return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        })
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const affiliateIncome = approvedEarnings
      .filter((item) => item.source === "affiliate")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const bkashIncome =
      approvedEarnings
        .filter((item) => item.source === "bkash")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0) + totalApprovedPayment;

    return {
      totalIncome,
      todayIncome,
      monthIncome,
      affiliateIncome,
      bkashIncome,
      pendingPayments: payments.filter((item) => item.status === "pending").length,
      approvedPayments: payments.filter((item) => item.status === "approved").length,
      totalClicks: clicks.length,
    };
  }, [earnings, payments, clicks]);

  const handleAddIncome = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const numericAmount = Number(amount);
    if (!incomeTitle || !numericAmount || numericAmount <= 0) {
      setMessage("Please enter valid income title and amount.");
      return;
    }

    try {
      await addDoc(collection(db, "earnings"), {
        incomeTitle,
        amount: numericAmount,
        source,
        status,
        note,
        createdAt: serverTimestamp(),
      });

      setIncomeTitle("");
      setAmount("");
      setSource("affiliate");
      setStatus("approved");
      setNote("");
      setMessage("Income added successfully.");
      await loadDashboardData();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Income add failed.");
    }
  };

  const updatePayment = async (id: string, nextStatus: Status) => {
    try {
      await updateDoc(doc(db, "paymentRequests", id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      await loadDashboardData();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Payment update failed.");
    }
  };

  const removePayment = async (id: string) => {
    try {
      await deleteDoc(doc(db, "paymentRequests", id));
      await loadDashboardData();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Payment delete failed.");
    }
  };

  const removeEarning = async (id: string) => {
    try {
      await deleteDoc(doc(db, "earnings", id));
      await loadDashboardData();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Income delete failed.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbf8]">
        <p className="text-lg font-bold text-[#2f9632]">Checking login...</p>
      </main>
    );
  }

  if (firebaseConfigMissing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbf8] px-4">
        <div className="max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black text-red-600">Firebase Config Missing</h1>
          <p className="mt-3 text-[#5f6b76]">Please add Firebase config inside .env.local file.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-[#2f9632] px-6 py-3 font-bold text-white">
            Go Login
          </Link>
        </div>
      </main>
    );
  }

  if (accessDenied) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbf8] px-4">
        <div className="max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#14202a]">Access Denied</h1>
          <p className="mt-3 text-[#5f6b76]">
            This dashboard is only for admin email: <b>{adminEmail}</b>
          </p>
          <p className="mt-2 text-sm text-[#5f6b76]">You are logged in as: {user?.email}</p>

          <button onClick={handleLogout} className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700">
            Logout
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fbf8] text-[#14202a]">
      <header className="border-b border-[#e6eee8] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#2f9632] bg-[#eef8f0] text-[#2f9632]">
              <Tag size={22} />
            </div>
            <h1 className="text-2xl font-black">
              NR<span className="text-[#2f9632]">DealHub</span>
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="flex items-center gap-2 rounded-xl bg-[#eef8f0] px-4 py-3 font-bold text-[#2f9632]"
            >
              <RefreshCcw size={17} />
              Refresh
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-50 px-5 py-3 font-bold text-red-600 hover:bg-red-100">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[2rem] bg-gradient-to-r from-[#0f5f2a] to-[#2f9632] p-8 text-white shadow-xl">
          <h2 className="text-3xl font-black">Admin Earnings Dashboard</h2>
          <p className="mt-2 opacity-90">Admin: {user?.email}</p>
          <p className="mt-1 opacity-90">bKash Receive Account: {bkashNumber}</p>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-[#e6eee8] bg-white p-4 font-bold text-[#2f9632]">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a href="/creative-manager" className="rounded-2xl bg-white p-5 font-black text-[#2f9632] shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
            Add DCM Creative Code
          </a>
          <a href="/creatives" className="rounded-2xl bg-white p-5 font-black text-[#2f9632] shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
            View Public Creatives
          </a>
          <a href="/payment-submit" className="rounded-2xl bg-white p-5 font-black text-[#2f9632] shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
            Payment Submit Page
          </a>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Income", value: money(stats.totalIncome), icon: DollarSign },
            { title: "Today Income", value: money(stats.todayIncome), icon: TrendingUp },
            { title: "This Month", value: money(stats.monthIncome), icon: CreditCard },
            { title: "Total Clicks", value: String(stats.totalClicks), icon: MousePointerClick },
            { title: "Affiliate Income", value: money(stats.affiliateIncome), icon: Store },
            { title: "bKash Income", value: money(stats.bkashIncome), icon: CreditCard },
            { title: "Pending Payments", value: String(stats.pendingPayments), icon: Mail },
            { title: "Approved Payments", value: String(stats.approvedPayments), icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border border-[#e6eee8] bg-white p-6 shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8f0] text-[#2f9632]">
                  <Icon size={24} />
                </div>
                <p className="text-sm font-bold text-[#5f6b76]">{item.title}</p>
                <h3 className="mt-2 text-2xl font-black">{item.value}</h3>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#e6eee8] bg-white p-6 shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
            <h3 className="mb-5 text-xl font-black">Add Manual Income</h3>
            <form onSubmit={handleAddIncome} className="grid gap-4">
              <input
                value={incomeTitle}
                onChange={(e) => setIncomeTitle(e.target.value)}
                className="rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none focus:border-[#2f9632]"
                placeholder="Income title"
              />
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none focus:border-[#2f9632]"
                placeholder="Amount"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as IncomeSource)}
                  className="rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none"
                >
                  <option value="affiliate">Affiliate</option>
                  <option value="bkash">bKash</option>
                  <option value="manual">Manual</option>
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-24 rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none focus:border-[#2f9632]"
                placeholder="Note"
              />
              <button className="rounded-xl bg-[#2f9632] px-6 py-4 font-black text-white hover:bg-[#0f5f2a]">
                Add Income
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-[#e6eee8] bg-white p-6 shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
            <h3 className="mb-5 text-xl font-black">Recent Clicks</h3>
            <div className="max-h-[430px] space-y-3 overflow-auto">
              {loadingData ? (
                <p className="text-[#5f6b76]">Loading...</p>
              ) : clicks.length === 0 ? (
                <p className="text-[#5f6b76]">No affiliate click yet.</p>
              ) : (
                clicks.slice(0, 10).map((item) => (
                  <div key={item.id} className="rounded-2xl bg-[#f7fbf8] p-4">
                    <p className="font-black">{item.dealTitle}</p>
                    <p className="text-sm text-[#5f6b76]">{item.category || "No category"}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#e6eee8] bg-white p-6 shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
          <h3 className="mb-5 text-xl font-black">Payment Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="border-b border-[#e6eee8] text-left text-sm text-[#5f6b76]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">TrxID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td className="p-4 text-[#5f6b76]" colSpan={6}>No payment request yet.</td>
                  </tr>
                ) : (
                  payments.map((item) => (
                    <tr key={item.id} className="border-b border-[#e6eee8]">
                      <td className="p-3 font-bold">{item.name}</td>
                      <td className="p-3">{item.contact}</td>
                      <td className="p-3 font-black text-[#2f9632]">{money(Number(item.amount || 0))}</td>
                      <td className="p-3">{item.transactionId}</td>
                      <td className="p-3">
                        <span className="rounded-full bg-[#eef8f0] px-3 py-1 text-xs font-black text-[#2f9632]">
                          {item.status}
                        </span>
                      </td>
                      <td className="flex gap-2 p-3">
                        <button onClick={() => updatePayment(item.id, "approved")} className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                          Approve
                        </button>
                        <button onClick={() => updatePayment(item.id, "rejected")} className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-bold text-yellow-700">
                          Reject
                        </button>
                        <button onClick={() => removePayment(item.id)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#e6eee8] bg-white p-6 shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
          <h3 className="mb-5 text-xl font-black">Manual Earnings</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {earnings.length === 0 ? (
              <p className="text-[#5f6b76]">No manual income added yet.</p>
            ) : (
              earnings.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#e6eee8] bg-[#f7fbf8] p-4">
                  <p className="font-black">{item.incomeTitle}</p>
                  <p className="mt-2 text-2xl font-black text-[#2f9632]">{money(Number(item.amount || 0))}</p>
                  <p className="mt-1 text-sm text-[#5f6b76]">Source: {item.source} — {item.status}</p>
                  {item.note && <p className="mt-2 text-sm text-[#5f6b76]">{item.note}</p>}
                  <button onClick={() => removeEarning(item.id)} className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
