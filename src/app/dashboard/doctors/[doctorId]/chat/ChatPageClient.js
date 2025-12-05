// ChatPageClient.js
'use client';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

let socket;

export default function ChatPageClient({ doctorId }) {
  const [userId, setUserId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  // STEP 0 — Get userId
  useEffect(() => {
    async function getUser() {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.userId) setUserId(data.userId);
    }
    getUser();
  }, []);

  // STEP 1 — Setup chat
  useEffect(() => {
    if (!userId) return;
    async function setupChat() {
      const res = await fetch('/api/chat/get-or-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, doctorId }),
      });
      const data = await res.json();
      setChatId(data.chat._id);

      const oldMsgsRes = await fetch('/api/chat/get-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: data.chat._id }),
      });
      const oldMsgs = await oldMsgsRes.json();
      setMessages(oldMsgs);
    }
    setupChat();
  }, [userId, doctorId]);

  // STEP 2 — Socket IO
  useEffect(() => {
    if (!chatId) return;

    fetch('/api/socket');
    socket = io({ path: '/api/socket' });
    socket.emit('join_room', chatId);

    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [chatId]);

  // STEP 3 — Send message
  const sendMessage = async () => {
    if (!text.trim() || !userId) return;
    const message = {
      roomId: chatId,
      text,
      senderId: userId,
      senderType: 'user',
      timestamp: new Date(),
    };
    socket.emit('send_message', message);
    setMessages((prev) => [...prev, message]);
    setText('');
    await fetch('/api/chat/add-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  };

  if (!userId) return <div className="text-white p-6 text-center">Loading user...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col">
      <div className="flex-1 bg-slate-800/40 p-6 rounded-2xl overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.senderId === userId ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-slate-800 p-3 rounded-lg border border-slate-700"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
