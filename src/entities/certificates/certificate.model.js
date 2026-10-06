import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Certificate title is required"],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, "Issuer organization name is required"],
      trim: true,
    },
    issuerLogo: {
      type: String,
      default: "",
    },
    certificateImage: {
      type: String,
      default: "",
    },
    issueDate: {
      type: String,
      required: [true, "Issue date is required (e.g. Nov 2024)"],
      trim: true,
    },
    credentialId: {
      type: String,
      trim: true,
      default: "",
    },
    verificationUrl: {
      type: String,
      trim: true,
      default: "",
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model("Certificate", certificateSchema);

export default Certificate;

