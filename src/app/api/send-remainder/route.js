import { NextResponse } from "next/server";
import { Resend } from "resend";
import dbConnect from "@/lib/mongodb";
import Medicine from "@/models/Medicine";
import User from "@/models/User";

// Remove the global initialization
// const resend = new Resend(process.env.RESEND_API_KEY); <--- DELETE THIS

export async function GET() {
  try {
    // Initialize inside the function
    const resend = new Resend(process.env.RESEND_API_KEY);

    await dbConnect();

    // Force server timezone to India (IST)
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().slice(0, 5);  // HH:MM

    console.log("Current IST time:", currentTime);

    const medicines = await Medicine.find({
      startDate: { $lte: currentDate },
      time: currentTime,
    });

    if (medicines.length === 0) {
      return NextResponse.json({ message: "No reminders right now" });
    }

    for (const med of medicines) {
      const endDate = new Date(med.startDate);
      endDate.setDate(endDate.getDate() + med.totalDays - 1);

      if (now > endDate) continue;

      const user = await User.findById(med.user);
      if (!user?.email) continue;

      await resend.emails.send({
        from: "Medicine Reminder <onboarding@resend.dev>",
        to: user.email,
        subject: `Time to take your medicine: ${med.name}`,
        text: `Hello! It's time to take your medicine.\n\nMedicine: ${med.name}\nDosage: ${med.dosage || "Not specified"}\nNotes: ${med.notes || "None"}\n\nTake care!`,
      });

      console.log(`Email sent to ${user.email} for medicine ${med.name}`);
    }

    return NextResponse.json({ message: "Emails sent" });
  } catch (error) {
    console.error("Reminder Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}