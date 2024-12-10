import mongoose from "mongoose";
const StudentSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      lowercase: true,
      required: true,
      minlength: [3, "fullname must be 3 letters long"],
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    password: String,
    username: {
      type: String,
      minlength: [8, "Username must be 8 letters long"],
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiredAt: Date,
    verificationToken: String,
    verificationTokenExpiredAt: Date,
  },
  { timestamps: true }
);
export default mongoose.model("Students", StudentSchema);
