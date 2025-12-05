import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Medicine from "@/models/Medicine";
import User from "@/models/User";

export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    try {
        // 1. Fetch User Basic Info (Exclude password)
        const user = await User.findById(userId).select("-password").lean();
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // 2. Fetch Medicines
        const medicines = await Medicine.find({ user: userId }).lean();

        // 3. Process Data for Analytics
        // We can pre-calculate some stats here to make the JSON more useful
        const analyticsData = medicines.map(med => {
            const total = med.totalDays || 1;
            const taken = med.dates?.length || 0;
            const adherenceScore = (taken / total) * 100;

            return {
                medicineId: med._id,
                name: med.name,
                dosage: med.dosage,
                startDate: med.startDate,
                scheduledDays: total,
                daysTakenCount: taken,
                adherencePercentage: adherenceScore.toFixed(2),
                datesTaken: med.dates, // Array of specific dates for heatmap generation
                isCompleted: taken >= total
            };
        });

        // 4. Return formatted JSON
        return NextResponse.json({
            generatedAt: new Date().toISOString(),
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                joinedAt: user.createdAt
            },
            healthStats: {
                totalMedicines: medicines.length,
                activeMedicines: analyticsData.filter(m => !m.isCompleted).length,
                completedCourses: analyticsData.filter(m => m.isCompleted).length,
            },
            rawdata: analyticsData
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}