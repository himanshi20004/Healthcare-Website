import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies(); // await cookies
    const token = cookieStore.get("token")?.value;
    if (!token) return new Response(JSON.stringify({ userId: null }), { status: 200 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return new Response(JSON.stringify({ userId: decoded.id }), { status: 200 }); // ✅ use decoded.id
  } catch (e) {
    console.error("JWT error:", e);
    return new Response(JSON.stringify({ userId: null }), { status: 200 });
  }
}
