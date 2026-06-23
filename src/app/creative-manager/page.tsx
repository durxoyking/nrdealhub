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
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon,
  LogOut,
  RefreshCcw,
  Save,
  ShieldCheck,
  Tag,
  Trash2,
} from "lucide-react";
import { auth, db, firebaseConfigMissing } from "@/lib/firebase";

type CreativeStatus = "active" | "inactive";

type Creative = {
  id: string;
  name: string;
  category: string;
  affiliateUrl: string;
  imageUrl: string;
  width?: string;
  height?: string;
  htmlCode: string;
  status: CreativeStatus;
};

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "durxoyking@gmail.com";

function parseCreativeCode(htmlCode: string) {
  if (typeof window === "undefined" || !htmlCode.trim()) {
    return {
      affiliateUrl: "",
      imageUrl: "",
      width: "",
      height: "",
      suggestedName: "",
    };
  }

  try {
    const parser = new DOMParser();
    const html = parser.parseFromString(htmlCode, "text/html");

    const anchor = html.querySelector("a[href]") as HTMLAnchorElement | null;
    const image = html.querySelector("img[src]") as HTMLImageElement | null;

    const affiliateUrl = anchor?.getAttribute("href") || "";
    const imageUrl = image?.getAttribute("src") || "";
    const width = image?.getAttribute("width") || "";
    const height = image?.getAttribute("height") || "";

    const fileName = imageUrl.split("/").pop() || "Creative Banner";
    const suggestedName = fileName.replace(/\.[^/.]+$/, "").replaceAll("_", " ");

    return {
      affiliateUrl,
      imageUrl,
      width,
      height,
      suggestedName,
    };
  } catch {
    return {
      affiliateUrl: "",
      imageUrl: "",
      width: "",
      height: "",
      suggestedName: "",
    };
  }
}

export default function CreativeManagerPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const [htmlCode, setHtmlCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Affiliate Banner");
  const [status, setStatus] = useState<CreativeStatus>("active");
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const parsed = useMemo(() => parseCreativeCode(htmlCode), [htmlCode]);

  useEffect(() => {
    if (parsed.suggestedName && !name) {
      setName(parsed.suggestedName);
    }
  }, [parsed.suggestedName, name]);

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
        setAccessDenied(false);
        setUser(currentUser);
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadCreatives = async () => {
    if (firebaseConfigMissing) return;

    try {
      setLoading(true);
      const snapshot = await getDocs(query(collection(db, "creatives")));
      const items = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Creative[];

      setCreatives(items.reverse());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Creative load failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !accessDenied) {
      loadCreatives();
    }
  }, [user, accessDenied]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!parsed.affiliateUrl || !parsed.imageUrl) {
      setMessage("Invalid creative code. Please paste full DCM HTML code with <a href> and <img src>.");
      return;
    }

    if (!name.trim()) {
      setMessage("Please enter creative name.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "creatives"), {
        name,
        category,
        affiliateUrl: parsed.affiliateUrl,
        imageUrl: parsed.imageUrl,
        width: parsed.width,
        height: parsed.height,
        htmlCode,
        status,
        source: "DCM Network",
        createdAt: serverTimestamp(),
      });

      setHtmlCode("");
      setName("");
      setCategory("Affiliate Banner");
      setStatus("active");
      setMessage("Creative saved successfully.");
      await loadCreatives();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Creative save failed.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, nextStatus: CreativeStatus) => {
    try {
      await updateDoc(doc(db, "creatives", id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      await loadCreatives();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Status update failed.");
    }
  };

  const removeCreative = async (id: string) => {
    try {
      await deleteDoc(doc(db, "creatives", id));
      await loadCreatives();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbf8]">
        <p className="text-lg font-bold text-[#2f9632]">Checking admin access...</p>
      </main>
    );
  }

  if (firebaseConfigMissing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbf8] px-4">
        <div className="max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black text-red-600">Firebase Config Missing</h1>
          <p className="mt-3 text-[#5f6b76]">Please fix .env.local first.</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-[#2f9632] px-6 py-3 font-bold text-white">
            Back Home
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
            Creative manager is only for admin: <b>{adminEmail}</b>
          </p>
          <button onClick={handleLogout} className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-bold text-white">
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
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-[#2f9632]">
            <ArrowLeft size={18} />
            Back Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/creatives" className="rounded-xl bg-[#eef8f0] px-5 py-3 font-bold text-[#2f9632]">
              Public Creatives
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-50 px-5 py-3 font-bold text-red-600">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[2rem] bg-gradient-to-r from-[#0f5f2a] to-[#2f9632] p-8 text-white shadow-xl">
          <h1 className="text-3xl font-black">DCM Creative Code Manager</h1>
          <p className="mt-2 opacity-90">Paste DCM HTML creative code. The system will auto extract affiliate link and banner image.</p>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-[#e6eee8] bg-white p-4 font-bold text-[#2f9632]">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleSave} className="rounded-3xl border border-[#e6eee8] bg-white p-6 shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
            <div className="mb-5 flex items-center gap-3">
              <Code2 className="text-[#2f9632]" />
              <h2 className="text-xl font-black">Add HTML Creative</h2>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-bold">Creative Name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none focus:border-[#2f9632]"
                  placeholder="Example: Big Spring Sale 728x90"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">Category</label>
                  <input
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none focus:border-[#2f9632]"
                    placeholder="Health / Fashion / Travel"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">Status</label>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as CreativeStatus)}
                    className="w-full rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Paste DCM HTML Code</label>
                <textarea
                  value={htmlCode}
                  onChange={(event) => setHtmlCode(event.target.value)}
                  className="min-h-56 w-full rounded-xl border border-[#e6eee8] bg-[#f7fbf8] px-4 py-4 font-mono text-sm outline-none focus:border-[#2f9632]"
                  placeholder='<a href="/" target="_blank"><img src="https://media.go2speed.org/..." /></a>'
                />
              </div>

              <button
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f9632] px-6 py-4 font-black text-white shadow-lg shadow-green-200 transition hover:bg-[#0f5f2a] disabled:opacity-60"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Creative"}
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-[#e6eee8] bg-white p-6 shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
            <div className="mb-5 flex items-center gap-3">
              <ImageIcon className="text-[#2f9632]" />
              <h2 className="text-xl font-black">Auto Preview</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[#f7fbf8] p-4">
                <div className="mb-2 flex items-center gap-2 font-bold">
                  <LinkIcon size={18} className="text-[#2f9632]" />
                  Affiliate URL
                </div>
                <p className="break-all text-sm text-[#5f6b76]">{parsed.affiliateUrl || "No affiliate link found yet."}</p>
              </div>

              <div className="rounded-2xl bg-[#f7fbf8] p-4">
                <div className="mb-2 flex items-center gap-2 font-bold">
                  <ImageIcon size={18} className="text-[#2f9632]" />
                  Banner Image
                </div>
                <p className="mb-4 break-all text-sm text-[#5f6b76]">{parsed.imageUrl || "No image found yet."}</p>

                {parsed.imageUrl && (
                  <a href={parsed.affiliateUrl || "#"} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-[#e6eee8] bg-white p-3">
                    <img src={parsed.imageUrl} alt="Creative preview" className="mx-auto max-h-56 w-auto max-w-full rounded-xl object-contain" />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#f7fbf8] p-4">
                  <p className="text-sm text-[#5f6b76]">Width</p>
                  <p className="text-xl font-black">{parsed.width || "-"}</p>
                </div>
                <div className="rounded-2xl bg-[#f7fbf8] p-4">
                  <p className="text-sm text-[#5f6b76]">Height</p>
                  <p className="text-xl font-black">{parsed.height || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#e6eee8] bg-white p-6 shadow-[0_20px_50px_rgba(15,95,42,0.08)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black">Saved Creatives</h2>
            <button onClick={loadCreatives} className="inline-flex items-center gap-2 rounded-xl bg-[#eef8f0] px-4 py-3 font-bold text-[#2f9632]">
              <RefreshCcw size={17} />
              Refresh
            </button>
          </div>

          {creatives.length === 0 ? (
            <p className="text-[#5f6b76]">No creative added yet.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {creatives.map((creative) => (
                <div key={creative.id} className="rounded-2xl border border-[#e6eee8] bg-[#f7fbf8] p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black">{creative.name}</h3>
                      <p className="text-sm text-[#5f6b76]">{creative.category}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${
                      creative.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>
                      {creative.status}
                    </span>
                  </div>

                  <a href={creative.affiliateUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl bg-white p-2">
                    <img src={creative.imageUrl} alt={creative.name} className="mx-auto h-32 w-full rounded-lg object-contain" />
                  </a>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => updateStatus(creative.id, creative.status === "active" ? "inactive" : "active")}
                      className="rounded-lg bg-[#eef8f0] px-3 py-2 text-xs font-bold text-[#2f9632]"
                    >
                      {creative.status === "active" ? "Make Inactive" : "Make Active"}
                    </button>

                    <a
                      href={creative.affiliateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600"
                    >
                      Open <ExternalLink size={13} />
                    </a>

                    <button
                      onClick={() => removeCreative(creative.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
