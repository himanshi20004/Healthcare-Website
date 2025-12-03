"use client";

import { useEffect, useState } from "react";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-gray-300">Loading doctors...</p>;

  if (doctors.length === 0)
    return <p className="text-gray-400">No doctors registered yet.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {doctors.map((doc) => (
        <div
          key={doc._id}
          className="bg-gray-900 p-4 rounded-lg shadow flex justify-between items-center text-white"
        >
          <div>
            <h2 className="text-xl font-bold">{doc.name}</h2>
            <p className="text-gray-400">{doc.specialization || "No specialization"}</p>
            <p className="text-gray-500 text-sm">
              {doc.experience ? `${doc.experience} years` : ""}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button className="bg-blue-600 px-3 py-1 rounded">
              Fix Appointment
            </button>
            <button className="bg-green-600 px-3 py-1 rounded">
              Start Chat
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
