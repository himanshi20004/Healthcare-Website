import { NextRequest, NextResponse } from "next/server";
import  connectDB  from "@/lib/mongodb";
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
    const body = await req.json(); // { name, dosage, user }
    if (!body.name || !body.user) {
      return new Response("Missing fields", { status: 400 });
    }

    const newMedicine = await Medicine.create({
      name: body.name,
      dosage: body.dosage || "",
      time: body.time || "", 
      user: body.user,
    });

    return NextResponse.json(newMedicine);
  } catch (err) {
    console.error(err);
    return new Response("Failed to add medicine", { status: 500 });
  }
}
