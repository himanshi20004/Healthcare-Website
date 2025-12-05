import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    const user = verifyToken(token);

    const { receiverId } = await req.json();

    const chat = new Chat({
      participants: [user.id, receiverId]
    });

    const result = await chat.save();

    return Response.json(result);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error creating chat" }, { status: 500 });
  }
}
