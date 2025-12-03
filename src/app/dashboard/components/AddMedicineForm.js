"use client";

import { useState } from "react";

export default function AddMedicineForm({ userId }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState(""); // ✅ new state
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
        body: JSON.stringify({ name, dosage, time, user: userId }), // ✅ include time
      });

      if (!res.ok) throw new Error("Failed to add medicine");

      // Clear form after success
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
    <form onSubmit={addMedicine} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Medicine Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        type="text"
        placeholder="Dosage"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="time" // ✅ HTML time input
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
        required
      />
      <button
        type="submit"
        disabled={loading}
         suppressHydrationWarning={true}
        className="bg-blue-600 hover:bg-blue-700 p-2 rounded mt-2"
      >
        {loading ? "Adding..." : "Add Medicine"}
      </button>
    </form>
  );
}
