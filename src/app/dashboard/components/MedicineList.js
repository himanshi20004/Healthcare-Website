"use client";

import { useEffect, useState } from "react";

export default function MedicineList({ userId }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMed, setSelectedMed] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // -----------------------------
  // FETCH MEDICINES
  // -----------------------------
  useEffect(() => {
    if (!userId) return;

    const fetchMedicines = async () => {
      try {
        const res = await fetch(`/api/medicines?userId=${userId}`);
        const data = await res.json();

        setMedicines(data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [userId]);

  // -----------------------------
  // OPEN CALENDAR POPUP
  // -----------------------------
  const openCalendar = (med) => {
    setSelectedMed(med);
    setSelectedDate(null);
  };

  // -----------------------------
  // SAVE DATE
  // -----------------------------
  const saveDate = async () => {
    if (!selectedDate || !selectedMed) return;

    try {
      const res = await fetch(`/api/medicines/${selectedMed._id}/dates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (!res.ok) throw new Error("Failed to save date");

      const updatedMed = await res.json();

      setMedicines((prev) => prev.map((m) => (m._id === updatedMed._id ? updatedMed : m)));
      setSelectedMed(null);
    } catch (err) {
      console.error("Saving date error:", err);
    }
  };

  if (loading) return <p className="text-gray-500">Loading medicines...</p>;
  if (!medicines.length) return <p className="text-gray-500">No medicines added yet.</p>;

  return (
    <>
      <ul className="flex flex-col gap-4">
        {medicines.map((med) => (
          <li
            key={med._id}
            className="p-4 bg-white rounded-3xl flex justify-between items-center shadow-md hover:shadow-xl transition"
          >
            <div>
              <p className="text-gray-900 font-semibold text-lg">{med.name}</p>
              <p className="text-gray-500 text-sm">{med.dosage || ""}</p>
              <p className="text-xs text-blue-600 mt-1">Saved Dates: {med?.dates?.join(", ") || "None"}</p>
            </div>

            <button
              onClick={() => openCalendar(med)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-md hover:scale-105 transition"
            >
              Mark Date
            </button>
          </li>
        ))}
      </ul>

      {selectedMed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-black">Select Date for {selectedMed.name}</h2>

            <input
              type="date"
              className="w-full p-3 rounded-xl border text-black"
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setSelectedMed(null)}
                className="px-4 py-2 rounded-xl text-black bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={saveDate}
                className="px-4 py-2 rounded-xl bg-green-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
