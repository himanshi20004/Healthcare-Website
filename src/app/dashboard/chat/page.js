import { MessageSquareDashed } from "lucide-react";

export default function ChatIndexPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquareDashed className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Select a conversation</h3>
            <p className="max-w-xs mt-2 text-sm">
                Choose a doctor from the sidebar to start chatting or view previous messages.
            </p>
        </div>
    );
}