"use client";

import { useState } from "react";

export default function MedicalAssistant() {
  const [doubt, setDoubt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!doubt.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/medical-assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doubt }),
      });
      const data = await res.json();
      setAnswer(data.answer || "Error: Could not get response.");
    } catch (err) {
      setAnswer("Error: Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4 py-10 flex justify-center items-start">
      <div className="max-w-3xl w-full">

        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-white mb-2 drop-shadow-xl">
          AI Medical Assistant
        </h1>
        <p className="text-center text-slate-400 mb-10">
          Ask any medical question & get instant guidance
        </p>

        {/* Input Card */}
        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-slate-700 transition-transform hover:scale-[1.02] hover:shadow-blue-700/40">
          <textarea
            className="w-full p-4 bg-slate-700/80 rounded-xl outline-none border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-slate-400 text-white"
            rows="5"
            placeholder="Describe your symptoms or ask any medical doubt..."
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
          />

          <button
            onClick={askAI}
            className="w-full mt-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition"
          >
            {loading ? "Analyzing..." : "Ask Assistant"}
          </button>
        </div>

        {/* Response Card */}
        {answer && (
          <div className="mt-8 bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-700 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-3 text-blue-400">
              Assistant Response
            </h2>
            <p className="text-slate-200 leading-relaxed whitespace-pre-line">
              {answer}
            </p>
          </div>
        )}
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
