"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                // 1. Call the API to clear the server-side cookie
                await fetch("/api/auth/logout", {
                    method: "POST",
                });

                // 2. Clear client-side storage (Token & Role)
                localStorage.removeItem("token");
                localStorage.removeItem("role");

                // 3. Force a refresh to clear any cached data and redirect to login
                router.refresh();
                router.push("/login");
            } catch (error) {
                console.error("Logout failed", error);
                // Fallback redirect even if API fails
                router.push("/login");
            }
        };

        handleLogout();
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Logging out...</h2>
            <p className="text-gray-500">Please wait while we secure your session.</p>
        </div>
    );
}