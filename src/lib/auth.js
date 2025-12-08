import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "./mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "please_set_a_secret";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
}

export async function getCurrentUser() {
  try {
    // 1️⃣ FIRST: Try NextAuth session (Google Auth)
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      await connectDB();
      let user = await User.findOne({ email: session.user.email }).lean();

      if (!user) {
        user = await User.create({
          name: session.user.name,
          email: session.user.email,
          avatar: session.user.image,
          authProvider: "google"
        });
      }
      return user;
    }

    // 2️⃣ SECOND: Your existing JWT logic (unchanged)
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll ? cookieStore.getAll() : [];
    const token = allCookies.find(c => c.name === "token")?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    await connectDB();
    const manualUser = await User.findById(decoded.id).lean();
    return manualUser || null;

  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}