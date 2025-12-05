import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import AddMedicineForm from "@/app/dashboard/components/AddMedicineForm";
import MedicineList from "@/app/dashboard/components/MedicineList";
import StatsCards from "@/app/dashboard/components/StatsCards";
import { MessageSquare } from "lucide-react"; // Import icon if available or just text

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
            <aside className="w-64 bg-gradient-to-b from-blue-600 to-purple-600 text-white p-6 flex flex-col gap-4 min-h-screen shadow-xl fixed h-full">
                <h2 className="text-2xl font-bold mb-6">Hello, {user.name}</h2>
                <nav className="flex flex-col gap-2">
                    <Link href="/dashboard" className="hover:bg-white/20 p-3 rounded-xl transition font-medium">Overview</Link>
                    <Link href="/dashboard/inbox" className="hover:bg-white/20 p-3 rounded-xl transition font-medium flex items-center gap-2 bg-white/10">
                        Messages / Inbox
                    </Link>
                    <Link href="/dashboard/doctors" className="hover:bg-white/20 p-3 rounded-xl transition font-medium">Find Doctors</Link>
                    <Link href="/dashboard/ai-assistance" className="hover:bg-white/20 p-3 rounded-xl transition font-medium">AI Assistant</Link>
                    <Link href="/dashboard/medicine-history" className="hover:bg-white/20 p-3 rounded-xl transition font-medium">History</Link>

                    <div className="mt-auto">
                        <Link href="/logout" className="hover:bg-red-500/30 p-3 rounded-xl transition bg-red-500/10 block text-center">Logout</Link>
                    </div>
                </nav>
            </aside>

            {/* Main Dashboard - Added ml-64 to offset fixed sidebar */}
            <main className="flex-1 p-8 ml-64">
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
            </main>
        </div>
    );
}