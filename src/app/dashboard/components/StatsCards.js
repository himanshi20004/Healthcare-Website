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

        const updatedData = data.map((med) => {
          const totalDays = med.totalDays || 10;
          const completedDays = med.completedDays || med.dates?.length || 0;
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

  if (loading) return <p className="text-gray-500">Loading stats...</p>;
  if (stats.length === 0) return <p className="text-gray-500">No medicines found.</p>;

  return (
   <div className="flex gap-6 overflow-x-auto p-4 w-full">
  {stats.map((med) => {
    const total = med.totalDays;
    const taken = med.completedDays;
    const percentage = Math.min(Math.round((taken / total) * 100), 100);

    return (
      <div
        key={med._id}
        className="min-w-[250px] bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-4xl shadow-lg flex-shrink-0 flex flex-col gap-4 hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105"
      >
        <p className="text-gray-900 font-bold text-xl tracking-wide">{med.name}</p>

        <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden shadow-inner">
          <div
            className="h-5 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-green-400 to-teal-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-600 text-right font-semibold">
          {taken}/{total} days ({percentage}%)
        </p>
      </div>
    );
  })}
</div>

  );
}