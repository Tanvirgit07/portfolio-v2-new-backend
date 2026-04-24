import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Resume title is required"],
      trim: true,
    },
    version: {
      type: String,
      default: "v1.0.0",
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume PDF file is required"],
    },
    publicId: {
      type: String, // ক্লাউডিনারির ফাইল আইডি
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;