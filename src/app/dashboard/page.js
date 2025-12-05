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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-purple-600 text-white p-6 flex flex-col gap-4 min-h-screen  shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Hello, {user.name}</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="hover:bg-white/20 p-3 rounded-xl transition">Overview</Link>
          <Link href="/dashboard/doctors" className="hover:bg-white/20 p-3 rounded-xl transition">Doctor Appointment</Link>
          <Link href="/dashboard/ai-assistance" className="hover:bg-white/20 p-3 rounded-xl transition">AI Assistance</Link>
          <Link href="/dashboard/performance-review" className="hover:bg-white/20 p-3 rounded-xl transition">Performance Review</Link>
          <Link href="/dashboard/medicine-history" className="hover:bg-white/20 p-3 rounded-xl transition">Medicine History</Link>
          <Link href="/logout" className="hover:bg-red-500/30 p-3 rounded-xl transition bg-red-500/10">Logout</Link>
        </nav>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900">Your Health Overview</h1>

        {/* Stats Cards */}
        {/* Stats Cards */}
<div className="mb-10">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Health Statistics</h2>
  <div className="w-full gap-6">
    <StatsCards userId={userId} />
  </div>
</div>


        {/* Medicine List */}
        <div className="bg-white p-8 rounded-3xl shadow-xl mb-10">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Your Medicines</h2>
          <MedicineList userId={userId} />
        </div>

        {/* Add Medicine Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl mb-20">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Add Medicine</h2>
          <AddMedicineForm userId={userId} />
        </div>
      </main>
    </div>
  );
}
