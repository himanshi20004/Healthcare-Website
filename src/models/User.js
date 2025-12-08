import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      // Password required ONLY for manual users
      required: function () {
        return this.authProvider === "manual";
      },
    },

    avatar: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ["manual", "google"],
      default: "manual",
    },
  },
  { timestamps: true }
);

// Prevent model overwrite error
export default mongoose.models.User || mongoose.model("User", userSchema);
