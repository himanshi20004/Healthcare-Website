"use client";

import { useState } from "react";

export default function AddMedicineForm({ userId }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  async function addMedicine(e) {
    e.preventDefault();
    if (!userId) {
      console.error("User ID missing!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/dashboard/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dosage, time, user: userId }),
      });

      if (!res.ok) throw new Error("Failed to add medicine");

      setName("");
      setDosage("");
      setTime("");
      alert("Medicine added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={addMedicine} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Medicine Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        required
      />
      <input
        type="text"
        placeholder="Dosage"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add Medicine"}
      </button>
    </form>
  );
}
