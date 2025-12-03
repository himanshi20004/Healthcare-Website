"use client";

import { useEffect, useState } from "react";

export default function MedicineList({ userId }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // FETCH MEDICINES
  // -----------------------------
  useEffect(() => {
    if (!userId) return;

    const fetchMedicines = async () => {
      try {
        const res = await fetch(`/api/medicines?userId=${userId}`);
        const data = await res.json();
        const now = new Date();
        
        const updatedData = data.map((med) => {
          // Compute if the doseCompletedAt is older than 24h
          if (med.doseCompletedAt) {
            const hoursPassed = (now - new Date(med.doseCompletedAt)) / (1000 * 60 * 60);
            if (hoursPassed >= 24) {
              return { ...med, todaysDoseComplete: false, doseCompletedAt: null };
            }
          }
          return med;
        });

        setMedicines(updatedData);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [userId]);

  // -----------------------------
  // TOGGLE DOSE
  // -----------------------------
  const toggleDose = async (medId) => {
    const now = new Date();

    setMedicines((prev) =>
      prev.map((med) => {
        if (med._id === medId) {
          const newValue = !med.todaysDoseComplete;
          return { ...med, todaysDoseComplete: newValue, doseCompletedAt: newValue ? now : null };
        }
        return med;
      })
    );

    // Update backend
    try {
      const med = medicines.find((m) => m._id === medId);
      const newValue = !med.todaysDoseComplete;
      const doseCompletedAt = newValue ? new Date() : null;

      const res = await fetch(`/api/medicines/${medId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todaysDoseComplete: newValue, doseCompletedAt }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedMed = await res.json();

      // Sync frontend with backend
      setMedicines((prev) =>
        prev.map((m) => (m._id === medId ? updatedMed : m))
      );
    } catch (err) {
      console.error("Toggle update error:", err);
    }
  };

  if (loading) return <p>Loading medicines...</p>;
  if (!medicines.length) return <p>No medicines added yet.</p>;

  // -----------------------------
  // RENDER MEDICINE LIST
  // -----------------------------
  return (
    <ul className="flex flex-col gap-3">
      {medicines.map((med) => (
        <li
          key={med._id}
          className="p-4 bg-gray-800 rounded-2xl flex justify-between items-center shadow-md hover:shadow-lg transition"
        >
          <div>
            <p className="text-white font-semibold">{med.name}</p>
            <p className="text-sm text-gray-400">{med.dosage || ""}</p>
          </div>

          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={med.todaysDoseComplete || false}
              onChange={() => toggleDose(med._id)}
            />
            <div className="w-12 h-6 bg-gray-600 rounded-full peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-green-500 transition-all"></div>
            <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all peer-checked:translate-x-6"></span>
          </label>
        </li>
      ))}
    </ul>
  );
}
