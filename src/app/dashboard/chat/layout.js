"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search } from "lucide-react";

export default function ChatLayout({ children }) {
    const [chats, setChats] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams(); // To highlight active chat

    useEffect(() => {
        async function loadInbox() {
            try {
                const res = await fetch("/api/chat/user");
                const data = await res.json();
                if (data.userId) {
                    setCurrentUserId(data.userId);
                    setChats(data.chats || []);
                }
            } catch (e) {
                console.error("Failed to load chats", e);
            } finally {
                setLoading(false);
            }
        }
        loadInbox();
    }, []);

    return (
        <div className="flex h-screen max-h-screen overflow-hidden bg-gray-100">
            {/* Chat Sidebar / List */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
                    ) : chats.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">
                            No chats yet. <br />
                            <Link href="/dashboard/doctors" className="text-blue-600 hover:underline">Find a doctor</Link>
                        </div>
                    ) : (
                        chats.map(chat => {
                            const other = chat.participants.find(p => p._id !== currentUserId) || {};
                            const isActive = params?.id === other._id; // Highlight if active

                            return (
                                <Link
                                    key={chat._id}
                                    href={`/dashboard/chat/${other._id}`}
                                    className={`flex items-center gap-3 p-4 border-b border-gray-50 transition hover:bg-gray-50 ${isActive ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                                        {other.name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-semibold truncate ${isActive ? "text-blue-700" : "text-gray-800"}`}>
                                            {other.name || "Unknown"}
                                        </h4>
                                        <p className="text-xs text-gray-500 truncate">
                                            Click to view chat
                                        </p>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
                {children}
            </div>
        </div>
    );
}