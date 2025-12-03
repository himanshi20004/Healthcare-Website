"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"] });

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        // Save JWT token and role in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert(data.message);
        router.push("/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      alert("Server error");
      console.error(err);
    }
  };

  return (
    <div className={`${poppins.className} min-h-screen flex items-center justify-center bg-slate-900 p-4`}>
      <div className="w-full max-w-md bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-700 animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center text-slate-100 drop-shadow-lg mb-8 tracking-wide">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 placeholder-slate-400
            focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all shadow-sm hover:shadow-md text-slate-100"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 placeholder-slate-400
            focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all shadow-sm hover:shadow-md text-slate-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold rounded-xl bg-blue-500 text-slate-100
            hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:text-blue-300 underline transition">
            Sign Up
          </a>
        </p>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
