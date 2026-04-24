import { cloudinaryUpload } from "../../lib/cloudinaryUpload.js";
import { createPaginationInfo } from "../../lib/pagination.js";
import Skill from "./skills.model.js";

export const createSkillService = async ({ body, files }) => {
  const { name, color, proficiency, description } = body;

  // ১. ইমেজ ফাইল চেক করা
  const skillImage = files?.skillImage?.[0]; // এখানে 'image' হলো FormData-র কি (Key)
  if (!skillImage) {
    throw new Error('Skill image is required!');
  }

  // ২. ক্লাউডিনারিতে ইমেজ আপলোড করা
  const uploadResult = await cloudinaryUpload(
    skillImage.path,
    `skill-${Date.now()}`,
    'portfoliov2/skills' // আপনার পছন্দমতো ফোল্ডার নাম
  );

  if (!uploadResult?.secure_url) {
    throw new Error('image upload failed');
  }

  // ৩. ডাটাবেজে সেভ করা
  const newSkill = await Skill.create({
    name,
    image: uploadResult.secure_url,
    color: color || "#c7d300",
    proficiency: proficiency !== undefined ? Number(proficiency) : 80,
    description
  });

  return newSkill;
};

export const updateSkillService = async ({ id, body, files }) => {
  const { name, color, proficiency, description } = body;

  // ১. প্রথমে চেক করা যে স্কিলটি ডাটাবেজে আছে কি না
  const existingSkill = await Skill.findById(id);
  if (!existingSkill) {
    throw new Error('Skill not found!');
  }

  let imageUrl = existingSkill.image; // ডিফল্ট হিসেবে আগের ইমেজটি রাখা হলো

  // ২. যদি নতুন ইমেজ ফাইল আপলোড করা হয়
  const newImage = files?.skillImage?.[0];
  if (newImage) {
    try {
      const uploadResult = await cloudinaryUpload(
        newImage.path,
        `skill-${Date.now()}`,
        'portfoliov2/skills'
      );

      if (!uploadResult?.secure_url) {
        throw new Error('image upload failed');
      }
      
      imageUrl = uploadResult.secure_url; // নতুন ইউআরএল সেট করা হলো
    } catch (err) {
      throw new Error('image upload failed');
    }
  }

  // ৩. ডাটাবেজ আপডেট করা
  const updatedSkill = await Skill.findByIdAndUpdate(
    id,
    {
      name: name || existingSkill.name,
      image: imageUrl,
      color: color || existingSkill.color,
      proficiency: proficiency !== undefined ? Number(proficiency) : existingSkill.proficiency,
      description: description || existingSkill.description
    },
    { new: true } // এটি আপডেট হওয়া নতুন ডাটাটি রিটার্ন করবে
  );

  return updatedSkill;
};

export const getAllSkillService = async ({ 
  page = 1, 
  limit = 10, 
  searchTerm = "" 
}) => {
  const filter = {};

  // সার্চ অপশন: যদি searchTerm থাকে তবে name ফিল্ডে সার্চ করবে
  if (searchTerm) {
    filter.name = { $regex: searchTerm, $options: 'i' }; // 'i' মানে case-insensitive
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  // মোট স্কিল সংখ্যা (ফিল্টার অনুযায়ী)
  const total = await Skill.countDocuments(filter);

  // ডাটা কুয়েরি
  const skills = await Skill.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    skills,
    paginationInfo: createPaginationInfo(pageNumber, limitNumber, total)
  };
};

export const getSingleSkillService = async (id) => {
  // আইডি দিয়ে স্কিলটি খুঁজে বের করা
  const skill = await Skill.findById(id);

  if (!skill) {
    throw new Error('Skill not found!');
  }

  return skill;
};

export const deleteSkillService = async (id) => {
  // ১. চেক করা স্কিলটি আসলে আছে কি না
  const skill = await Skill.findById(id);
  
  if (!skill) {
    throw new Error('Skill not found!');
  }

  // ২. ডাটাবেজ থেকে ডিলিট করা
  await Skill.findByIdAndDelete(id);

  return skill;
};