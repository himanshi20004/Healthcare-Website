"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MedicineDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch medicine data
    const fetchMedicine = async () => {
        try {
            // We can reuse the single ID API or filter from list. 
            // Assuming you might need to create GET /api/medicines/[id] if not exists.
            // For now, let's assume we fetch all and find one, or update your API to support single fetch.
            // Ideally: GET /api/medicines/${id}

            // Let's rely on your existing patch route logic but add GET to it, 
            // OR mostly people just fetch the specific doc.
            // Note: You need to ensure your API supports fetching one medicine.
            // If not, create src/app/api/medicines/details/[id]/route.js

            const res = await fetch(`/api/medicines/details/${id}`);
            if (!res.ok) throw new Error("Failed to load");
            const data = await res.json();
            setMedicine(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicine();
    }, [id]);

    const toggleDate = async (dateStr) => {
        if (!medicine) return;

        const isTaken = medicine.dates.includes(dateStr);

        // Optimistic UI Update
        const newDates = isTaken
            ? medicine.dates.filter(d => d !== dateStr)
            : [...medicine.dates, dateStr];

        setMedicine({ ...medicine, dates: newDates });

        // API Call
        await fetch("/api/medicines/toggle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: medicine._id,
                date: dateStr,
                status: !isTaken
            }),
        });
    };

    if (loading) return <div className="p-10 text-center">Loading details...</div>;
    if (!medicine) return <div className="p-10 text-center">Medicine not found</div>;

    // --- Heatmap Generation Logic ---
    const today = new Date();
    const days = [];
    // Generate last 365 days
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        // Adjust for timezone to match your stored "YYYY-MM-DD"
        const offset = d.getTimezoneOffset() * 60000;
        const dateStr = new Date(d.getTime() - offset).toISOString().split('T')[0];
        days.push({
            date: d,
            str: dateStr,
            taken: medicine.dates.includes(dateStr)
        });
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <button
                onClick={() => router.back()}
                className="mb-6 text-gray-500 hover:text-black flex items-center gap-2"
            >
                ← Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">{medicine.name}</h1>
                        <p className="text-gray-500 mt-1">{medicine.dosage} • {medicine.time}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold text-green-600">
                            {medicine.dates.length}
                        </p>
                        <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Days Taken</p>
                    </div>
                </div>

                <h3 className="font-bold text-gray-700 mb-4">Consistency Graph (Last 365 Days)</h3>

                {/* The GitHub Style Grid */}
                <div className="flex flex-wrap gap-1">
                    {days.map((day, i) => (
                        <div
                            key={day.str}
                            onClick={() => toggleDate(day.str)}
                            title={`${day.str} - ${day.taken ? "Taken" : "Missed"}`}
                            className={`
                        w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-125
                        ${day.taken ? "bg-green-500 shadow-sm" : "bg-gray-100 hover:bg-gray-200"}
                    `}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-100 rounded-sm"></div> Not Taken
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-sm"></div> Taken
                    </div>
                </div>
            </div>
        </div>
    );
}