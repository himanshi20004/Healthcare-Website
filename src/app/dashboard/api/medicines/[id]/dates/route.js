import connectDB from "@/lib/mongodb";
import Medicine from "@/models/Medicine";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const { date } = await req.json(); // e.g., "2025-12-05"

    if (!date) {
      return new Response("Date required", { status: 400 });
    }

    // Add date to the medicine document
    const updatedMed = await Medicine.findByIdAndUpdate(
      id,
      { $addToSet: { dates: date } }, // addToSet avoids duplicate dates
      { new: true } // return the updated document
    ).lean();

    if (!updatedMed) {
      return new Response("Medicine not found", { status: 404 });
    }

    return NextResponse.json(updatedMed);
  } catch (err) {
    console.error(err);
    console.log(err)
    return new Response("Failed to save date", { status: 500 });
  }
}
