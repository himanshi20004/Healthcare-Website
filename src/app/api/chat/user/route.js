import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User"; // Ensure User model is registered

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    const user = verifyToken(token);

    if (!user) return new Response("Unauthorized", { status: 401 });

    // Find chats and populate participants details (excluding password)
    const chats = await Chat.find({
      participants: { $in: [user.id] }
    })
      .populate("participants", "name email role")
      .sort({ updatedAt: -1 }); // Show newest first

    return Response.json({ userId: user.id, chats });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error fetching chats" }, { status: 500 });
  }
}