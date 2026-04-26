import { cloudinaryUpload } from "../../lib/cloudinaryUpload.js";
import { createPaginationInfo } from "../../lib/pagination.js";
import aboutModel from "./about.model.js";

export const createAboutContent = async ({ body, files }) => {
  const {
    titleLine1,
    titleLine2,
    typewriterStrings,
    descriptions,
    stats,
    ctaText,
    ctaLink
  } = body;

  // ১. প্রোফাইল ইমেজ হ্যান্ডেল করা
  const profileImageFile = files?.profileImage?.[0]; // আপনার ইনপুট ফিল্ডের নাম profileImage হতে হবে
  if (!profileImageFile) {
    throw new Error('profileImage is required!');
  }

  const uploadResult = await cloudinaryUpload(
    profileImageFile.path,
    `about-${Date.now()}`,
    'portfoliov2/about'
  );

  if (!uploadResult?.secure_url) {
    throw new Error('image upload failed');
  }

  // ২. অ্যারে ডেটা পার্স করা (যদি ফ্রন্টএন্ড থেকে JSON String হিসেবে আসে)
  const parseJSON = (data, errorMsg) => {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (err) {
      throw new Error(errorMsg);
    }
  };

  const parsedTypewriter = parseJSON(typewriterStrings, 'Invalid typewriterStrings format');
  const parsedDescriptions = parseJSON(descriptions, 'Invalid descriptions format');
  const parsedStats = parseJSON(stats, 'Invalid stats format');

  // ৩. ডাটাবেসে সেভ করা (About Model ব্যবহার করে)
  const newAbout = await aboutModel.create({
    titleLine1,
    titleLine2,
    profileImage: uploadResult.secure_url,
    typewriterStrings: parsedTypewriter || [],
    descriptions: parsedDescriptions || [],
    stats: parsedStats || [],
    ctaText,
    ctaLink,
    isActive: false // ডিফল্টভাবে ইন-অ্যাক্টিভ থাকবে
  });

  return newAbout;
};

export const updateAboutContent = async ({ id, body, files }) => {
  const {
    titleLine1,
    titleLine2,
    typewriterStrings,
    descriptions,
    stats,
    ctaText,
    ctaLink,
    isActive
  } = body;

  // ১. প্রথমে চেক করা এই ID-তে কোনো ডেটা আছে কি না
  const existingAbout = await aboutModel.findById(id);
  if (!existingAbout) {
    throw new Error('About story not found!');
  }

  // ২. ইমেজ আপডেট লজিক
  let profileImageUrl = existingAbout.profileImage; // ডিফল্টভাবে আগের ইমেজ
  const profileImageFile = files?.profileImage?.[0];

  if (profileImageFile) {
    const uploadResult = await cloudinaryUpload(
      profileImageFile.path,
      `about-update-${Date.now()}`,
      'portfoliov2/about'
    );

    if (!uploadResult?.secure_url) {
      throw new Error('image upload failed');
    }
    profileImageUrl = uploadResult.secure_url; // নতুন ইমেজ URL সেট করা
  }

  // ৩. JSON ডেটা পার্স করার হেল্পার
  const parseJSON = (data, errorMsg) => {
    if (data === undefined || data === null) return undefined;
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (err) {
      throw new Error(errorMsg);
    }
  };

  const parsedTypewriter = parseJSON(typewriterStrings, 'Invalid typewriterStrings format');
  const parsedDescriptions = parseJSON(descriptions, 'Invalid descriptions format');
  const parsedStats = parseJSON(stats, 'Invalid stats format');

  // ৪. ডাটাবেসে আপডেট করা
  const updatedAbout = await aboutModel.findByIdAndUpdate(
    id,
    {
      titleLine1,
      titleLine2,
      profileImage: profileImageUrl,
      typewriterStrings: parsedTypewriter,
      descriptions: parsedDescriptions,
      stats: parsedStats,
      ctaText,
      ctaLink,
      isActive: isActive !== undefined ? isActive : existingAbout.isActive
    },
    { new: true, runValidators: true } // নতুন আপডেট হওয়া ডেটা রিটার্ন করবে
  );

  return updatedAbout;
};

export const getAllAboutService = async ({ page = 1, limit = 10, isActive }) => {
  const filter = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const total = await aboutModel.countDocuments(filter);

  const abouts = await aboutModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    abouts,
    paginationInfo: createPaginationInfo(pageNumber, limitNumber, total)
  };
};

export const getSingleAboutService = async (id) => {
  const about = await aboutModel.findById(id);

  if (!about) {
    throw new Error('About content not found!');
  }

  return about;
};

export const deleteAboutService = async (id) => {
  const about = await aboutModel.findById(id);

  if (!about) {
    throw new Error('About content not found!');
  }

  const result = await aboutModel.findByIdAndDelete(id);
  return result;
};

export const toggleAboutStatusService = async (id, isActive) => {
  // ১. চেক করা এই আইডি-তে ডেটা আছে কি না
  const about = await aboutModel.findById(id);
  if (!about) {
    throw new Error('About content not found!');
  }

  // ২. বডি থেকে আসা isActive ভ্যালু সরাসরি ডাটাবেসে সেট করা
  const updatedAbout = await aboutModel.findByIdAndUpdate(
    id,
    { isActive: isActive },
    { new: true, runValidators: true }
  );

  return updatedAbout;
};

export const getActiveAboutService = async () => {
  // শুধুমাত্র active ডকুমেন্টটি খোঁজা হচ্ছে এবং লেটেস্টটি নেওয়া হচ্ছে
  const activeAbout = await aboutModel.findOne({ isActive: true })
    .sort({ createdAt: -1 });

  if (!activeAbout) {
    throw new Error('No active about section found');
  }

  return activeAbout;
};