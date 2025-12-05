"use client";

import { useEffect, useState } from "react";

export default function ChatPage({ params }) {
  const receiverId = params.doctorId;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function loadMessages() {
    const res = await fetch("/api/message/get", {
      method: "POST",
      body: JSON.stringify({ receiverId })
    });
    const data = await res.json();
    setMessages(data);
  }

  async function sendMessage() {
    if (!text.trim()) return;

    await fetch("/api/message/add", {
      method: "POST",
      body: JSON.stringify({ receiverId, content: text })
    });

    setText("");
    loadMessages();
  }

  useEffect(() => {
    loadMessages();
    const timer = setInterval(loadMessages, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat</h2>

      <div className="bg-gray-100 h-[70vh] overflow-y-auto p-4 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="my-2">
            <p><strong>{msg.sender}</strong>: {msg.content}</p>
          </div>
        ))}
      </div>

      <div className="flex mt-4">
        <input
          className="flex-1 p-2 border rounded"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}
