import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-950">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 p-10 shadow-sm">
        <h1 className="text-4xl font-black capitalize">search</h1>
        <p className="mt-4 text-slate-600">NRDealHub Global Buy Sell Marketplace system is active.</p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-green-600 px-6 py-3 font-black text-white">Back Home</Link>
      </div>
    </main>
  );
}
