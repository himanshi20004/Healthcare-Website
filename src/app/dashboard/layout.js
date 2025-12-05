import { getCurrentUser } from "@/lib/auth";
import Sidebar from "./components/SideBar";

export default async function DashboardLayout({ children }) {
    const user = await getCurrentUser();
    const userName = user ? user.name : "Guest";

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar userName={userName} />
            <main className="flex-1 ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}