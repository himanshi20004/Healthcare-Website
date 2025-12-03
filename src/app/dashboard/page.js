import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

import AddMedicineForm from "@/app/dashboard/components/AddMedicineForm";
import MedicineList from "@/app/dashboard/components/MedicineList";
import StatsCards from "@/app/dashboard/components/StatsCards";

export default async function DashboardPage() {
  const rawUser = await getCurrentUser();

  if (!rawUser) {
    return <p className="p-6 text-red-500">Please login to view dashboard</p>;
  }

  const user = JSON.parse(JSON.stringify(rawUser));
  const userId = user._id;
  console.log(userId)
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-4">Welcome, {user.name}</h2>
        <Link href="/dashboard" className="hover:bg-gray-700 p-2 rounded">Overview</Link>
        <Link href="/dashboard/doctors" className="hover:bg-gray-700 p-2 rounded">Doctor Appointment</Link>
        <Link href="/dashboard/ai-assistance" className="hover:bg-gray-700 p-2 rounded">AI Assistance</Link>
        <Link href="/dashboard/performance-review" className="hover:bg-gray-700 p-2 rounded">Performance Review</Link>
        <Link href="/dashboard/medicine-history" className="hover:bg-gray-700 p-2 rounded">History of Medicines</Link>
        <Link href="/logout" className="hover:bg-gray-700 p-2 rounded">Logout</Link>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 p-6 bg-gray-900 overflow-auto text-white">
        <h1 className="text-3xl font-semibold mb-6">Your Health Overview</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8  ">
          <StatsCards userId={userId} />
        </div>

        {/* Medicine List */}
        <div className="bg-gray-800 p-6 rounded-xl shadow mb-8">
          <h2 className="text-lg font-bold mb-4">Your Medicines</h2>
          <MedicineList userId={userId} />
        </div>

        {/* Add Medicine */}
        <div className="bg-gray-800 p-6 rounded-xl shadow mb-20">
          <h2 className="text-lg font-bold mb-4">Add Medicine</h2>
          <AddMedicineForm userId={userId} />
        </div>
      </div>
    </div>
  );
}
