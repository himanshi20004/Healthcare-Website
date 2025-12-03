import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB(); // make sure DB connects
    const all = await User.find();
console.log("ALL USERS:", all);
    const doctors = await User.find({ role: "doctor" });
    console.log(doctors);
    return new Response(JSON.stringify(doctors), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("DOCTOR API ERROR:", err);

    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
