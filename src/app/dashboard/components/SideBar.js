"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    UserRound,
    Stethoscope,
    History,
    LogOut
} from "lucide-react";

export default function Sidebar({ userName }) {
    const pathname = usePathname();

    const isActive = (path) => {
        // Exact match for dashboard, partial match for others (e.g. /dashboard/chat/123 should highlight chat)
        if (path === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(path);
    };

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Messages", href: "/dashboard/chat", icon: MessageSquare },
        { name: "Find Doctors", href: "/dashboard/doctors", icon: UserRound },
        { name: "AI Assistant", href: "/dashboard/ai-assistance", icon: Stethoscope },
        { name: "History", href: "/dashboard/medicine-history", icon: History },
    ];

    return (
        <aside className="w-64 bg-gradient-to-b from-blue-600 to-purple-600 text-white p-6 flex flex-col gap-4 fixed h-full z-20 shadow-xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">HealthPlus</h2>
                <p className="text-blue-100 text-sm">Welcome, {userName || "User"}</p>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 p-3 rounded-xl transition font-medium ${active
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <Link
                    href="/logout"
                    className="flex items-center gap-3 p-3 rounded-xl transition font-medium bg-red-500/10 text-red-100 hover:bg-red-500/30"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Link>
            </div>
        </aside>
    );
}