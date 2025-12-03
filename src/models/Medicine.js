import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  time: { type: String, required: true }, // "HH:MM" format
  todaysDoseComplete: { type: Boolean, default: false },
  doseCompletedAt: { type: Date }, // store when it was completed
  createdAt: { type: Date, default: Date.now },
});

const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);
export default Medicine;
