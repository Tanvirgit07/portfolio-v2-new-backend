import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  titleLine1: { 
    type: String, 
    required: [true, "Title Line 1 is required"] 
  },
  titleLine2: { 
    type: String, 
    required: [true, "Title Line 2 is required"] 
  },
  profileImage: { type: String, default: "" },
  typewriterStrings: [{ type: String }],
  descriptions: [{ type: String }],
  stats: [{
    label: { type: String },
    value: { type: String }
  }],
  ctaText: { type: String },
  ctaLink: { type: String },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

const About = mongoose.model("About", AboutSchema);

export default About;