import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        // Fetch all users
        const all = await User.find();

        // Fetch only doctors
        const doctors = await User.find({ role: "doctor" });

        return NextResponse.json({ all, doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}