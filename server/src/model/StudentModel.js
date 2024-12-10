import mongoose from "mongoose";
const StudentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, uniue: true },
    password: { type: String, required: true },
    verifyOTP: { type: String, default: "" },
    verifyOTPExpiresAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOTP: { type: String, default: "" },
    resetOTPExpiresAt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Students", StudentSchema);
