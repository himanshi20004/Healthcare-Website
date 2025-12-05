"use client";

import { useState } from "react";

export default function AddMedicineForm({ userId }) {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    time: "",
    totalDays: "7", // Default 1 week
    startDate: new Date().toISOString().split('T')[0], // Default today
    notes: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function addMedicine(e) {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);

    try {
      const res = await fetch("/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user: userId }),
      });

      if (!res.ok) throw new Error("Failed to add medicine");

      alert("Medicine added successfully!");
      // Reset form but keep start date as today
      setForm({
        name: "",
        dosage: "",
        time: "",
        totalDays: "7",
        startDate: new Date().toISOString().split('T')[0],
        notes: ""
      });

      // Optional: Refresh page or trigger parent update
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={addMedicine} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Name */}
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-gray-700">Medicine Name</label>
        <input
          name="name"
          type="text"
          placeholder="e.g. Paracetamol"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      {/* Dosage */}
      <div>
        <label className="text-sm font-bold text-gray-700">Dosage</label>
        <input
          name="dosage"
          type="text"
          placeholder="e.g. 500mg"
          value={form.dosage}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Time */}
      <div>
        <label className="text-sm font-bold text-gray-700">Time</label>
        <input
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      {/* Total Days */}
      <div>
        <label className="text-sm font-bold text-gray-700">Course Duration (Days)</label>
        <input
          name="totalDays"
          type="number"
          min="1"
          placeholder="e.g. 7"
          value={form.totalDays}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="text-sm font-bold text-gray-700">Start Date</label>
        <input
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      {/* Notes */}
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-gray-700">Notes / Instructions</label>
        <textarea
          name="notes"
          rows="2"
          placeholder="e.g. Take after food"
          value={form.notes}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Submit */}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Medicine Course"}
        </button>
      </div>
    </form>
  );
}