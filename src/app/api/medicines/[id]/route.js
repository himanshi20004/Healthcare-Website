import connectDB from "@/lib/mongodb";
import Medicine from "@/models/Medicine";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = await params; // 

  const body = await req.json();

  const updated = await Medicine.findByIdAndUpdate(id, body, { new: true });

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated, { status: 200 });
}
