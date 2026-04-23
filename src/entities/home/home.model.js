import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema(
  {
    backgroundImage: {
      type: String,
      required: true
    },
    overlayOpacity: {
      type: Number,
      default: 20
    },
    typingAnimationLines: {
      type: [String],
      required: true
    },
    titleLine1: {
      type: String,
      required: true
    },
    titleLine2: {
      type: String
    },
    description: {
      type: String,
      required: true
    },
    primaryBtnText: {
      type: String,
      default: 'Download CV'
    },
    cvFileUrl: {
      type: String
    },
    secondaryBtnText: {
      type: String,
      default: 'Watch Video'
    },
    videoUrl: {
      type: String
    },

    // ✅ NEW FIELD
    isActive: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Hero = mongoose.models.Hero || mongoose.model('Hero', heroSchema);
export default Hero;
