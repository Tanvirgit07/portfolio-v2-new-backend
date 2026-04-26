import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Insight title is required"],
      trim: true,
    },

    category: {
      type: String,
      enum: ["Blog", "Logic", "Problem Solving"], // আপনার সিলেক্ট অপশন অনুযায়ী
      required: [true, "Category is required"],
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },

    fullContent: {
      type: String, // Markdown বা টেক্সট সেভ করার জন্য
      required: [true, "Full content is required"],
    },

    // ✅ সর্বোচ্চ ৫টি ইমেজ রাখার জন্য ভ্যালিডেশনসহ ইমেজ অ্যারে
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String },
        }
      ],
      validate: [arrayLimit, '{PATH} exceeds the limit of 5 images']
    },

    // ✅ থাম্বনেইল ইমেজ (আলাদা করে রাখতে চাইলে)
    thumbnail: {
      url: { type: String },
      publicId: { type: String },
    },

    // ✅ ভিডিও এম্বেড লিঙ্ক বা ইউআরএল
    videoUrl: {
      type: String,
      trim: true,
    },

    // ✅ ইমপ্লিমেন্টেশন লজিক বা কোড স্নsnippet
    logicSnippet: {
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

// ইমেজ লিমিট চেক করার ফাংশন
function arrayLimit(val) {
  return val.length <= 5;
}

// মডেলটি যদি আগে তৈরি করা থাকে তবে সেটি ব্যবহার করবে, নয়তো নতুন তৈরি করবে
const Knowledge = mongoose.models.Knowledge || mongoose.model("Knowledge", knowledgeSchema);

export default Knowledge;