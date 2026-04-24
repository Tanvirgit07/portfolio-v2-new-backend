import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "suggestion",
        "shortlisted",
        "not-fit",
        "more-projects",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      default: "Anonymous",
    },

    role: {
      type: String,
      default: "Recruiter",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);