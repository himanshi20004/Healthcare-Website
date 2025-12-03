"use client";

import { useEffect, useState } from "react";

export default function StatsCards({ userId }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchStats() {
      try {
        const res = await fetch(`/api/medicines?userId=${userId}`);
        const data = await res.json();

        // Optional: calculate completedDays if backend only has dose history
        const updatedData = data.map((med) => {
          const totalDays = med.totalDays || 10; // default 10
          const completedDays = med.completedDays || 0; // fetch from backend or calculate
          return { ...med, totalDays, completedDays };
        });

        setStats(updatedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  if (loading) return <p>Loading stats...</p>;
  if (stats.length === 0) return <p>No medicines found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((med) => {
        const total = med.totalDays;
        const taken = med.completedDays;
        const percentage = Math.min(Math.round((taken / total) * 100), 100);

        return (
          <div
            key={med._id}
            className="bg-gray-700 p-4 rounded-2xl shadow-md flex flex-col gap-3 animate-fadeIn"
          >
            <p className="text-sm text-gray-300 font-semibold">{med.name}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-600 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <p className="text-xs text-gray-400 text-right">
              {taken}/{total} days ({percentage}%)
            </p>
          </div>
        );
      })}
    </div>
  );
}
