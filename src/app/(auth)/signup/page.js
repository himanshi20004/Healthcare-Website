"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"] });

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert(data.message);
        // Clear form fields before redirect
        setForm({ name: "", email: "", password: "", role: "patient" });
        router.push("/login");
      } else {
        alert(data.error || "Signup failed");
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
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 placeholder-slate-400
            focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all shadow-sm hover:shadow-md text-slate-100"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })}
            className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 placeholder-slate-400
            focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all shadow-sm hover:shadow-md text-slate-100"
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 placeholder-slate-400
            focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all shadow-sm hover:shadow-md text-slate-100"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 placeholder-slate-400
            focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all shadow-sm hover:shadow-md text-slate-100"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold rounded-xl bg-blue-500 text-slate-100
            hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300 underline transition">
            Login
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
