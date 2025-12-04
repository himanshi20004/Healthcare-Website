"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"] });

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans">
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl"
      >
        {/* Logo/Image */}
        <div className="flex justify-center mb-8">
          <Image
            src="/doctori.png"
            alt="Healthcare Logo"
            width={120}
            height={120}
            className="rounded-full drop-shadow-xl"
          />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </span>
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Log in to track your health, manage medicines, and consult with doctors.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </motion.div>
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </motion.div>

          {/* Buttons */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </motion.button>

          <p className="text-center text-gray-500">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-500 font-semibold hover:underline"
            >
              Sign Up
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
