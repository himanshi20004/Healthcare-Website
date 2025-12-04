"use client";

import { useState } from "react";

export default function MedicalAssistant() {
  const [doubt, setDoubt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askAI = async () => {
    if (!doubt.trim()) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const res = await fetch("/api/medical-assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doubt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2 drop-shadow-lg text-blue-400">
          AI Medical Assistant
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Ask any medical question & get instant guidance
        </p>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-slate-700 transition hover:scale-[1.005] hover:shadow-blue-700/20">
          {/* Textarea */}
          <textarea
            className="w-full p-4 bg-slate-700 rounded-xl outline-none border border-slate-600 focus:border-blue-500 transition placeholder-slate-400 text-slate-100 resize-none"
            rows="4"
            placeholder="Describe your symptoms or ask any medical doubt..."
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
          />

          {/* Button */}
          <button
            onClick={askAI}
            disabled={loading || !doubt.trim()}
            className={`w-full mt-4 py-3 text-lg font-semibold rounded-xl transition shadow-md 
              ${loading || !doubt.trim()
                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              "Ask Assistant"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-900/50 p-4 rounded-xl border border-red-700 text-red-200 text-center animate-fadeIn">
            {error}
          </div>
        )}

        {/* Response */}
        {answer && (
          <div className="mt-8 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-3 text-emerald-400 flex items-center gap-2">
              <span className="text-2xl">🩺</span> Assistant Response
            </h2>
            <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
              {answer}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500 italic">
              Disclaimer: This is AI-generated advice. Always consult a real doctor for serious conditions.
            </div>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}