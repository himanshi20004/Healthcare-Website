import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    const user = verifyToken(token);

    const { receiverId, content } = await req.json();
    const senderId = user.id;

    // find existing conversation
    let conversation = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Chat.create({
        participants: [senderId, receiverId]
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      content
    });

    return Response.json(message);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error sending message" }, { status: 500 });
  }
}
