import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    const user = verifyToken(token);

    const { receiverId } = await req.json();
    const senderId = user.id;

    const conversation = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      return Response.json({ messages: [] });
    }

    const messages = await Message.find({
      conversationId: conversation._id
    }).sort({ createdAt: 1 });

    return Response.json(messages);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error fetching messages" }, { status: 500 });
  }
}
