import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    image: {
      type: String, // এখানে ইমেজের URL স্টোর হবে
      required: [true, "Skill icon image is required"],
    },
    color: {
      type: String,
      default: "#c7d300",
    },
    proficiency: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 80,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxLength: [120, "Description cannot be more than 120 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

export default Skill;