import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    // ✅ Checkbox থেকে আসা সার্ভিসগুলো অ্যারে হিসেবে সেভ হবে
    services: [
      {
        type: String,
        enum: ["Web Design", "Mobile App Design", "Collaboration", "Others"],
      },
    ],
    message: {
      type: String,
      required: [true, "Message cannot be empty"],
      trim: true,
    },
    // কুয়েরি স্ট্যাটাস ট্র্যাকিং করার জন্য (Optional but helpful)
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Replied"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// যদি আগে মডেল তৈরি থাকে তবে সেটি নিবে, না থাকলে নতুন তৈরি করবে
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;