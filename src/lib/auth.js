import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import  connectDB  from "./mongodb.js";
import User from "@/models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "please_set_a_secret";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
}

// Server-side function
export async function getCurrentUser() {
  try {
    // Await cookies()
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll ? cookieStore.getAll() : [];
    const token = allCookies.find(c => c.name === "token")?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    await connectDB();
    const user = await User.findById(decoded.id).lean();
    return user;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}
