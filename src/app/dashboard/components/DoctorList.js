"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(""); // <-- NEW
  const router = useRouter();

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        setDoctors(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  // 🔍 Filter doctors on search
  useEffect(() => {
    const q = query.toLowerCase();
    const f = doctors.filter((doc) => {
      const name = doc.name?.toLowerCase() || "";
      const spec = doc.specialization?.toLowerCase() || "";
      return name.includes(q) || spec.includes(q);
    });

    setFiltered(f);
  }, [query, doctors]);

  async function startChat(doctorId) {
    await fetch("/api/chat/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: doctorId })
    });

    router.push(`/dashboard/chat/${doctorId}`);
  }

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-pulse">
        <div className="h-32 bg-gray-800 rounded-xl"></div>
        <div className="h-32 bg-gray-800 rounded-xl"></div>
      </div>
    );

  return (
    <div>
      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search doctors by name or specialization..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className=" p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white border  focus:border-blue-500 outline-none"
      />

      {/* Doctor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {filtered.length === 0 ? (
          <p className="text-gray-400 col-span-full">No doctors found.</p>
        ) : (
          filtered.map((doc) => (
            <div
              key={doc._id}
              className="bg-gradient-to-r from-blue-500 to-purple-500 p-5 rounded-xl border flex justify-between items-center text-white hover:border-blue-500 transition shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 font-bold text-lg">
                  {doc.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{doc.name}</h2>
                  <p className="text-blue-300 text-sm font-medium">
                    {doc.specialization
                      ? doc.specialization
                      : doc.role?.toUpperCase() || "DOCTOR"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => startChat(doc._id)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition shadow-md text-sm font-semibold"
              >
                Chat
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}