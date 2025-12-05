import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function POST(req) {
  try {
    await connectDB();

    const { firstId, secondId } = await req.json();

    const chat = await Chat.findOne({
      participants: { $all: [firstId, secondId] }
    });

    return Response.json(chat);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error finding chat" }, { status: 500 });
  }
}
