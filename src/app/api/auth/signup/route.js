import connectDB  from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password)
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });

    const existing = await User.findOne({ email });
    if (existing)
      return new Response(JSON.stringify({ error: "Email exists" }), { status: 409 });

    const hashed = await bcrypt.hash(password, 10);

    // 👇 Save role here
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "patient",   // defaults to patient if not provided
    });
    console.log(user)
    const token = signToken({ id: user._id, email: user.email, role: user.role });

    return new Response(JSON.stringify({ message: "Signup successful" }), {
      status: 201,
      headers: {
        "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        "Content-Type": "application/json"
      }
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
