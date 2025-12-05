"use client";

import { useEffect, useState, use } from "react";

export default function ChatWindow({ params }) {
    const resolvedParams = use(params);
    const receiverId = resolvedParams.id;

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);

    // 1. Fetch Current User ID
    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => setCurrentUserId(data.userId));
    }, []);

    // 2. Load Messages
    async function loadMessages() {
        try {
            const res = await fetch("/api/message/get", {
                method: "POST",
                body: JSON.stringify({ receiverId })
            });
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        }
    }

    // 3. Polling for new messages
    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [receiverId]);

    // 4. Send Message
    async function sendMessage() {
        if (!text.trim()) return;

        // Optimistic Update
        const tempMsg = {
            content: text,
            sender: currentUserId,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMsg]);
        setText("");

        await fetch("/api/message/add", {
            method: "POST",
            body: JSON.stringify({ receiverId, content: text })
        });

        loadMessages(); // Refresh to get real ID/Status
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur">
                <span className="font-bold text-gray-700">Chat</span>
                <span className="text-xs text-green-500 font-medium px-2 py-1 bg-green-50 rounded-full">● Online</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {messages.map((msg, i) => {
                    const isMe = msg.sender === currentUserId;
                    return (
                        <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    className="flex gap-2"
                >
                    <input
                        className="flex-1 bg-gray-100 text-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition"
                        placeholder="Type your message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}