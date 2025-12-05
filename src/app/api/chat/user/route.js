import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    const user = verifyToken(token);

    const chats = await Chat.find({
      participants: { $in: [user.id] }
    });

    return Response.json(chats);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error fetching chats" }, { status: 500 });
  }
}
