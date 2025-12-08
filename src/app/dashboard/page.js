import { getCurrentUser } from "@/lib/auth";
import AddMedicineForm from "@/app/dashboard/components/AddMedicineForm";
import MedicineList from "@/app/dashboard/components/MedicineList";
import StatsCards from "@/app/dashboard/components/StatsCards";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="p-8 text-red-500">Please log in.</div>;
  }

  const userId = user._id.toString();

  // -------------------- DOCTOR VIEW --------------------
  if (user.role === "doctor") {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900">
          Doctor Dashboard
        </h1>

        

        {/* Appointments */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Appointments</h2>
          <p className="text-gray-600">Appointments feature coming soon...</p>
        </div>

        
      </div>
    );
  }

  // -------------------- USER VIEW  --------------------
  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900">Your Health Overview</h1>

      {/* Stats Cards */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Health Statistics</h2>
        <div className="w-full gap-6">
          <StatsCards userId={userId} />
        </div>
      </div>

      {/* Medicine List */}
      <div className="bg-white p-8 rounded-3xl shadow-xl mb-10 border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Your Medicines</h2>
        <MedicineList userId={userId} />
      </div>

      {/* Add Medicine Form */}
      <div className="bg-white p-8 rounded-3xl shadow-xl mb-20 border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Add Medicine</h2>
        <AddMedicineForm userId={userId} />
      </div>
    </div>
  );
}
