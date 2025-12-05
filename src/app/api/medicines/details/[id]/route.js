import connectDB from "@/lib/mongodb";
import Medicine from "@/models/Medicine";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB();
    const { id } = await params;
    try {
        const medicine = await Medicine.findById(id);
        if (!medicine) return new Response("Not found", { status: 404 });
        return NextResponse.json(medicine);
    } catch (err) {
        return new Response("Error", { status: 500 });
    }
}