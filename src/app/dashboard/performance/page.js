"use client";

import { useEffect, useState } from "react";
import { Brain, AlertCircle, CheckCircle, Loader2, XCircle, TrendingUp } from "lucide-react";

export default function PerformancePage() {
    const [userId, setUserId] = useState(null);
    const [status, setStatus] = useState("loading");
    const [predictions, setPredictions] = useState([]);
    const [loadingPreds, setLoadingPreds] = useState(false);

    // AI Server URL
    const AI_SERVER = "http://localhost:8000";

    // 1. Get User ID
    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data.userId) {
                    setUserId(data.userId);
                    checkModelStatus(data.userId);
                }
            });
    }, []);

    // 2. Check Python Server Status
    const checkModelStatus = async (uid) => {
        try {
            const res = await fetch(`${AI_SERVER}/status/${uid}`);
            if (!res.ok) throw new Error("AI Server Unreachable");
            const data = await res.json();
            setStatus(data.state);

            if (data.state === "trained") {
                generatePredictions(uid);
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    // 3. Trigger Training
    const startTraining = async () => {
        if (!userId) return;
        setStatus("training");
        try {
            const res = await fetch(`${AI_SERVER}/train`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            setStatus(data.state); // Likely 'training' or 'not_enough_data'
        } catch (err) {
            setStatus("error");
        }
    };

    // 4. Generate Predictions for Next 3 Days
    const generatePredictions = async (uid) => {
        setLoadingPreds(true);
        try {
            // A. Get Active Medicines first
            const medRes = await fetch(`/api/medicines?userId=${uid}`);
            const allMeds = await medRes.json();

            // Filter active only
            const activeMeds = allMeds.filter(m => {
                const taken = m.dates ? m.dates.length : 0;
                const total = m.totalDays || 7;
                return taken < total;
            });

            if (activeMeds.length === 0) {
                setLoadingPreds(false);
                return;
            }

            // B. Calculate Dates (Tomorrow, +2, +3)
            const dates = [];
            for (let i = 1; i <= 3; i++) {
                const d = new Date();
                d.setDate(d.getDate() + i);
                dates.push(d.toISOString().split('T')[0]);
            }

            // C. Fetch Predictions for every med/date combo
            const promises = [];

            dates.forEach(date => {
                activeMeds.forEach(med => {
                    const p = fetch(`${AI_SERVER}/predict`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: uid,
                            date: date,
                            medicine_name: med.name,
                            total_daily_medicines: activeMeds.length
                        })
                    }).then(r => r.json()).then(res => ({
                        date,
                        medicine: med.name,
                        time: med.time,
                        ...res // { prediction, probability_score }
                    }));
                    promises.push(p);
                });
            });

            const results = await Promise.all(promises);
            setPredictions(results);

        } catch (err) {
            console.error("Prediction error", err);
        } finally {
            setLoadingPreds(false);
        }
    };

    // --- UI HELPERS ---

    const getStatusCard = () => {
        switch (status) {
            case "error":
                return (
                    <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4 text-red-700">
                        <XCircle className="w-10 h-10" />
                        <div>
                            <h3 className="font-bold text-lg">AI Service Unavailable</h3>
                            <p className="text-sm">Please ensure the Python server is running on port 8000.</p>
                        </div>
                    </div>
                );
            case "not_enough_data":
                return (
                    <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 text-orange-800 mb-4">
                            <AlertCircle className="w-10 h-10" />
                            <div>
                                <h3 className="font-bold text-lg">Data Gathering Phase</h3>
                                <p className="text-sm">The AI needs at least 30 days of history to learn your patterns.</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "5%" }}></div>
                        </div>
                        <p className="text-right text-xs text-orange-600 mt-2">Current: ~1 day / 30 days</p>
                    </div>
                );
            case "not_trained":
                return (
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-blue-800">
                            <Brain className="w-10 h-10" />
                            <div>
                                <h3 className="font-bold text-lg">Model Ready to Train</h3>
                                <p className="text-sm">We have enough data to personalize your assistant.</p>
                            </div>
                        </div>
                        <button
                            onClick={startTraining}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                        >
                            Start Training
                        </button>
                    </div>
                );
            case "training":
                return (
                    <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl flex items-center gap-4 text-purple-800 animate-pulse">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <div>
                            <h3 className="font-bold text-lg">AI is Learning...</h3>
                            <p className="text-sm">Training your custom model. This usually takes a few seconds.</p>
                        </div>
                    </div>
                );
            case "trained":
                return (
                    <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex items-center gap-4 text-green-800">
                        <CheckCircle className="w-10 h-10" />
                        <div>
                            <h3 className="font-bold text-lg">AI Active</h3>
                            <p className="text-sm">Your model is trained and predicting adherence patterns.</p>
                        </div>
                    </div>
                );
            default:
                return <div className="p-6 text-gray-400">Loading AI status...</div>;
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Performance Review</h1>
            <p className="text-gray-500 mb-10">AI-driven insights into your upcoming medicine schedule.</p>

            {/* Status Section */}
            <div className="mb-10">
                {getStatusCard()}
            </div>

            {/* Prediction Section (Only if Trained) */}
            {status === "trained" && (
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        Predictions (Next 3 Days)
                    </h2>

                    {loadingPreds ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>
                    ) : predictions.length === 0 ? (
                        <p className="text-gray-400 italic">No active medicines to predict.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {predictions.map((item, idx) => {
                                const isLikely = item.raw_prediction === 1;
                                const dateObj = new Date(item.date).toDateString();

                                return (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg">{item.medicine}</h3>
                                                <p className="text-xs text-gray-500">{dateObj}</p>
                                            </div>
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                                                {item.time}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Forecast:</span>
                                                <span className={`font-bold ${isLikely ? "text-green-600" : "text-red-500"}`}>
                                                    {isLikely ? "Likely to Take" : "Risk of Missing"}
                                                </span>
                                            </div>

                                            {/* Confidence Bar */}
                                            <div>
                                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                    <span>Confidence</span>
                                                    <span>{Math.round(item.probability_score * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${isLikely ? "bg-green-500" : "bg-red-500"}`}
                                                        style={{ width: `${item.probability_score * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}