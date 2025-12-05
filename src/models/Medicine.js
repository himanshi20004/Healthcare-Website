import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  dosage: { type: String },
  time: { type: String, required: true }, // "HH:MM" format

  // New Fields
  totalDays: { type: Number, required: true, default: 7 }, // Course duration
  startDate: { type: String, required: true }, // YYYY-MM-DD
  notes: { type: String },

  dates: { type: [String], default: [] }, // Array of "YYYY-MM-DD" that were marked
  createdAt: { type: Date, default: Date.now },
});

const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);
export default Medicine;