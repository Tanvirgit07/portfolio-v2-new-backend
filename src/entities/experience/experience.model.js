import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    duration: {
      type: String, // e.g. "June 2020 - May 2021"
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    side: {
      type: String,
      enum: ["left", "right"],
      default: "left",
    },

    achievements: [
      {
        type: String,
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;