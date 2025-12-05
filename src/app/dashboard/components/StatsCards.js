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

        // Process data
        const updatedData = data.map((med) => {
          // Fallback: If totalDays is missing (old data), assume 7 days
          const total = med.totalDays ? med.totalDays : 7;
          const taken = med.dates ? med.dates.length : 0;

          return {
            ...med,
            totalDays: total,
            completedDays: taken,
            isFinished: taken >= total
          };
        });

        // Only show Active medicines
        const activeOnly = updatedData.filter(m => !m.isFinished);
        setStats(activeOnly);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  if (loading) return <div className="animate-pulse h-32 bg-gray-200 rounded-3xl w-full"></div>;
  if (stats.length === 0) return <p className="text-gray-400 italic">No active medicines being tracked.</p>;

  return (
    <div className="flex gap-6 overflow-x-auto p-4 w-full pb-8 scrollbar-hide">
      {stats.map((med) => {
        const percentage = Math.min(Math.round((med.completedDays / med.totalDays) * 100), 100);

        return (
          <div
            key={med._id}
            className="min-w-[280px] bg-white border border-gray-100 p-6 rounded-3xl shadow-lg flex-shrink-0 flex flex-col gap-3 hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-900 font-bold text-xl">{med.name}</h3>
                <p className="text-xs text-gray-500">
                  {med.totalDays} Day Course
                </p>
              </div>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
                {med.time}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span className="text-blue-600">{percentage}%</span>
                <span className="text-gray-400 text-xs mt-1">{med.completedDays} / {med.totalDays} days</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}