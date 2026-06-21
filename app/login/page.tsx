"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div dir="ltr" lang="en" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 w-full max-w-sm border border-slate-100"
      >
        <div className="text-center mb-8">
          <Image src="/logo-dark.svg" alt="My Clinic" width={120} height={32} className="mx-auto mb-5" />
          <h1 className="text-xl font-bold text-slate-900">Dashboard Login</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in with your @myclinic.com.sa email</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5 font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@myclinic.com.sa"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#004d99] focus:border-transparent transition-all text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#004d99] focus:border-transparent transition-all text-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#004d99] text-white font-semibold py-3 rounded-lg hover:bg-[#003d7a] transition-all text-sm disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
