import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },

    category: {
      type: String,
      required: [true, 'Project category is required'],
      trim: true
    },

    // ✅ Multiple Images
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }
      }
    ],

    // ✅ Single Video
    video: {
      url: { type: String },
      publicId: { type: String }
    },

    // ✅ Dynamic Links (Frontend-এর 'name' এর সাথে মিল রাখা হয়েছে)
    links: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        url: {
          type: String,
          required: true,
          trim: true
        }
      }
    ],

    tags: [{ type: String, trim: true }],

    // ✅ Description (Rich Text String হিসেবে সেভ হবে)
    description: {
      type: String,
      trim: true
    },

    logicSnippet: {
      type: String,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
