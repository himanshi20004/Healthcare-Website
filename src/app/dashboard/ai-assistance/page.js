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

    const res = await fetch("/api/medical-assistance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doubt }),
    });
    console.log("Received doubt:", doubt);
    const data = await res.json();
    setLoading(false);

    if (data.answer) setAnswer(data.answer);
    else setAnswer("Error: Could not get response.");
  };

  return (
    <div className="text-white px-4 py-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2 drop-shadow-lg">
          AI Medical Assistant
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Ask any medical question & get instant guidance
        </p>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-slate-700 transition hover:scale-[1.01] hover:shadow-blue-700/30">
          
          {/* Textarea */}
          <textarea
            className="w-full p-4 bg-slate-700 rounded-xl outline-none border border-slate-600 focus:border-blue-500 transition placeholder-slate-400"
            rows="4"
            placeholder="Describe your symptoms or ask any medical doubt..."
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
          />

          {/* Button */}
          <button
            onClick={askAI}
            className="w-full mt-4 py-3 bg-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            {loading ? "Analyzing..." : "Ask Assistant"}
          </button>
        </div>

        {/* Response */}
        {answer && (
          <div className="mt-8 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 animate-fadeIn">
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
            from { opacity: 0; transform: translateY(10px); }
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
