"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // To navigate to detail view

export default function MedicineList({ userId }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local state to track checkbox changes before saving
  const [markedIds, setMarkedIds] = useState(new Set());
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  // Get Today's Date in YYYY-MM-DD format (Local time)
  const getTodayStr = () => {
    const d = new Date();
    // Adjust for timezone offset to get strictly local YYYY-MM-DD
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  };

  const todayStr = getTodayStr();

  useEffect(() => {
    if (!userId) return;
    fetchMedicines();
  }, [userId]);

  const fetchMedicines = async () => {
    try {
      const res = await fetch(`/api/medicines?userId=${userId}`);
      const data = await res.json();

      // FILTER: Only show medicines where taken days < total days
      const activeMedicines = data.filter(med => {
        const taken = med.dates ? med.dates.length : 0;
        const total = med.totalDays || 1;
        return taken < total;
      });

      setMedicines(activeMedicines);

      // Initialize markedIds based on database data
      const initialMarked = new Set();
      data.forEach(med => {
        if (med.dates && med.dates.includes(todayStr)) {
          initialMarked.add(med._id);
        }
      });
      setMarkedIds(initialMarked);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckbox = (id) => {
    const newSet = new Set(markedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setMarkedIds(newSet);
  };

  const handleSaveDay = async () => {
    setSaving(true);
    try {
      // Process all medicines in parallel
      const promises = medicines.map(med => {
        const isTaken = markedIds.has(med._id);
        return fetch("/api/medicines/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: med._id,
            date: todayStr,
            status: isTaken
          }),
        });
      });

      await Promise.all(promises);
      alert("Daily log saved!");
      fetchMedicines(); // Refresh data
    } catch (err) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-20 bg-gray-200 rounded-xl"></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div>
          <h3 className="font-bold text-blue-900">Today's Checklist</h3>
          <p className="text-sm text-blue-600">{new Date().toDateString()}</p>
        </div>
        <button
          onClick={handleSaveDay}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Log"}
        </button>
      </div>

      <div className="grid gap-4">
        {medicines.map((med) => (
          <div
            key={med._id}
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center justify-between"
          >
            {/* Clickable Area to go to Details */}
            <div
              className="flex-1 cursor-pointer"
              onClick={() => router.push(`/dashboard/medicine/${med._id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                  Rx
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">
                    {med.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {med.dosage} • {med.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Checkbox Area */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-sm font-medium text-gray-600">Taken?</span>
                <input
                  type="checkbox"
                  checked={markedIds.has(med._id)}
                  onChange={() => toggleCheckbox(med._id)}
                  className="w-6 h-6 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}