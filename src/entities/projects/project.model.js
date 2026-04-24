import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Project category is required"],
      trim: true, // এখন এটি যেকোনো স্ট্রিং গ্রহণ করবে
    },
    thumbnail: {
      url: {
        type: String,
        required: [true, "Project thumbnail is required"],
      },
      publicId: {
        type: String, // ক্লাউডিনারি ফাইল আইডি (ভবিষ্যতে ডিলিট করার জন্য)
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      }
    ],
    description: [
      {
        type: String, // প্যারাগ্রাফ স্টোর করার জন্য স্ট্রিং অ্যারে
        trim: true,
      }
    ],
    logicSnippet: {
      type: String,
      trim: true,
    },
    liveLink: {
      type: String,
      trim: true,
    },
    sourceCode: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;