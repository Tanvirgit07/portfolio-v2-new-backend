import { cloudinaryUpload } from "../../lib/cloudinaryUpload.js";
import { createPaginationInfo } from "../../lib/pagination.js";
import Resume from "./resume.model.js";

export const createResumeService = async ({ body, files }) => {
  const { title, version } = body;

  // ১. ফাইল চেক করা (React থেকে 'resumeFile' কি-তে পাঠাতে হবে)
  const resumeFile = files?.resumeFile?.[0]; 
  if (!resumeFile) {
    throw new Error('Resume PDF file is required!');
  }

  // ২. ক্লাউডিনারিতে PDF আপলোড করা
  // টিপস: PDF এর জন্য আমরা ফোল্ডার নাম দিচ্ছি 'resumes'
  const uploadResult = await cloudinaryUpload(
    resumeFile.path,
    `resume-${Date.now()}`,
    'portfoliov2/resumes'
  );

  if (!uploadResult?.secure_url) {
    throw new Error('PDF upload failed');
  }

  // ৩. ডাটাবেজে সেভ করা
  const newResume = await Resume.create({
    title,
    version: version || "v1.0.0",
    resumeUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id
  });

  return newResume;
};

export const getAllResumeService = async ({ page = 1, limit = 10, isActive }) => {
  const filter = {};

  // isActive ফিল্টার চেক (যদি কোয়েরি প্যারামিটারে পাঠানো হয়)
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  // মোট ডকুমেন্টের সংখ্যা বের করা
  const total = await Resume.countDocuments(filter);

  // ডাটা ফেচ করা (Pagination ও Sorting সহ)
  const resumes = await Resume.find(filter)
    .sort({ createdAt: -1 }) // লেটেস্ট আগে দেখাবে
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    resumes,
    // আপনার সিস্টেমে থাকা pagination helper টি ব্যবহার করা হয়েছে
    paginationInfo: createPaginationInfo(pageNumber, limitNumber, total)
  };
};

export const updateResumeStatusService = async (id, isActive) => {
  // ১. রেজ্যুমেটি ডাটাবেজে আছে কি না চেক করা
  const resume = await Resume.findById(id);
  if (!resume) {
    throw new Error('Resume not found!');
  }

  // ২. যদি নতুন স্ট্যাটাস true হয়, তবে বাকি সবগুলোকে false করে দেওয়া
  if (isActive === true) {
    await Resume.updateMany({ _id: { $ne: id } }, { isActive: false });
  }

  // ৩. নির্দিষ্ট রেজ্যুমেটির স্ট্যাটাস আপডেট করা
  resume.isActive = isActive;
  await resume.save();

  return resume;
};

export const deleteResumeService = async ({ id }) => {
  // ডাটাবেজ থেকে ডিলিট করা
  const resume = await Resume.findByIdAndDelete(id);

  // যদি রেজ্যুমে খুঁজে না পাওয়া যায়
  if (!resume) {
    throw new Error('Resume not found');
  }

  return resume;
};