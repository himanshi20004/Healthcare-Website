import Medicine from "@/models/Medicine";
import connectDB from "@/lib/mongodb";

export async function PATCH(req, { params }) {
  const id = params.id;

  await connectDB();
  const body = await req.json();

  const updated = await Medicine.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(updated, { status: 200 });
}
