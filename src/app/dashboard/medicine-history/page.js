"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                // 1. Get User ID from Client Side API (Safe for "use client")
                const authRes = await fetch("/api/auth/me");
                const authData = await authRes.json();

                if (!authData.userId) {
                    setLoading(false);
                    return;
                }

                // 2. Fetch Medicines
                const res = await fetch(`/api/medicines?userId=${authData.userId}`);
                const data = await res.json();

                // 3. Filter: Only show finished medicines
                const finished = data.filter(med => {
                    const taken = med.dates ? med.dates.length : 0;
                    const total = med.totalDays || 1;
                    return taken >= total;
                });

                setHistory(finished);
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className="p-8 text-gray-500">Loading history...</div>

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Medicine History</h1>

            {history.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">No completed medicine courses yet.</p>
                    <p className="text-gray-300 text-sm">When you finish a course, it appears here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {history.map(med => (
                        <div key={med._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 opacity-75 hover:opacity-100 transition">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 line-through decoration-2 decoration-green-500">{med.name}</h2>
                                    <p className="text-gray-500">{med.dosage} • {med.totalDays} Day Course</p>
                                    <p className="text-sm text-green-600 font-semibold mt-1">
                                        Completed on {med.dates[med.dates.length - 1] || "Unknown"}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
                                    Finished
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}