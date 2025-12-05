import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Medicine from "@/models/Medicine";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return new Response("UserId required", { status: 400 });

  const medicines = await Medicine.find({ user: userId }).lean();
  return NextResponse.json(medicines);
}

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    // Validation
    if (!body.name || !body.user || !body.totalDays || !body.startDate) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newMedicine = await Medicine.create({
      name: body.name,
      dosage: body.dosage || "",
      time: body.time || "",
      totalDays: Number(body.totalDays),
      startDate: body.startDate,
      notes: body.notes || "",
      user: body.user,
    });

    return NextResponse.json(newMedicine);
  } catch (err) {
    console.error(err);
    return new Response("Failed to add medicine", { status: 500 });
  }
}