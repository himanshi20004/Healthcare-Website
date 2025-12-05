"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  async function startChat(doctorId) {
    // 1. Create/Find Chat logic
    await fetch("/api/chat/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: doctorId })
    });

    // 2. Redirect to the DASHBOARD chat layout
    router.push(`/dashboard/chat/${doctorId}`);
  }

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-pulse"><div className="h-32 bg-gray-800 rounded-xl"></div><div className="h-32 bg-gray-800 rounded-xl"></div></div>;
  if (doctors.length === 0) return <p className="text-gray-400">No doctors available.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {doctors.map((doc) => (
        <div
          key={doc._id}
          className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center text-white hover:border-blue-500 transition shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 font-bold text-lg">
              {doc.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{doc.name}</h2>
              <p className="text-blue-300 text-sm font-medium">{doc.role ? doc.role.toUpperCase() : "DOCTOR"}</p>
            </div>
          </div>

          <button
            onClick={() => startChat(doc._id)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition shadow-md text-sm font-semibold"
          >
            Chat
          </button>
        </div>
      ))}
    </div>
  );
}