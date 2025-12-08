// pages/signup/index.js or app/signup/page.js
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import { signIn } from "next-auth/react"; // <-- Import is correct

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
    <div
      className={`${poppins.className} min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden`}
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl"
      >
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Create Your Account
          </span>
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Sign up to track your health, manage medicines, and consult with doctors.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition shadow-sm"
          />

          <motion.input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value.toLowerCase() })
            }
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition shadow-sm"
          />

          <motion.input
            type="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition shadow-sm"
          />

          <motion.select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition shadow-sm"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </motion.select>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r 
            from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <motion.button
          // 💡 FIX: Pass the callbackUrl to redirect to the dashboard
          onClick={() => signIn("google", { callbackUrl: "/login" })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-white border border-gray-300 rounded-xl shadow-sm 
          hover:shadow-md flex items-center justify-center gap-3"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={22}
            height={22}
            alt="Google Logo"
          />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </motion.button>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-400 font-semibold underline transition"
          >
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}