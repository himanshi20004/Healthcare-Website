import connectDB from "@/lib/mongodb";
import Medicine from "@/models/Medicine";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();
    try {
        const { id, date, status } = await req.json(); // status: true (taken), false (not taken)

        if (!id || !date) return new Response("Missing data", { status: 400 });

        let updateQuery;

        if (status === true) {
            // Add date if not exists
            updateQuery = { $addToSet: { dates: date } };
        } else {
            // Remove date if exists
            updateQuery = { $pull: { dates: date } };
        }

        const updatedMed = await Medicine.findByIdAndUpdate(
            id,
            updateQuery,
            { new: true }
        );

        return NextResponse.json(updatedMed);
    } catch (err) {
        console.error(err);
        return new Response("Error updating medicine", { status: 500 });
    }
}