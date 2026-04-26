import { cloudinaryDelete } from "../../lib/cloudinaryDelete.js";
import { cloudinaryUpload } from "../../lib/cloudinaryUpload.js";
import Knowledge from "./knoledge.model.js";

export const createKnowledgeContent = async ({ body, files }) => {
  const { title, category, shortDescription, fullContent, logicSnippet, isActive } = body;

  // ✅ Image handling (Max 5 validation on model, but check here too)
  const imageFiles = files?.images || [];
  if (imageFiles.length === 0) throw new Error("At least one image is required!");

  const uploadedImages = [];
  for (const file of imageFiles) {
    const result = await cloudinaryUpload(file.path, `knowledge-${Date.now()}`, "portfoliov2/knowledge");
    if (!result?.secure_url) throw new Error("image upload failed");
    uploadedImages.push({ url: result.secure_url, publicId: result.public_id });
  }

  // ✅ Video handling (Optional)
  let videoUrl = body.videoUrl; // Direct YouTube link if provided
  const videoFile = files?.video?.[0];

  if (videoFile) {
    const videoResult = await cloudinaryUpload(videoFile.path, `video-${Date.now()}`, "portfoliov2/knowledge/videos");
    videoUrl = videoResult.secure_url;
  }

  const newKnowledge = await Knowledge.create({
    title,
    category,
    shortDescription,
    fullContent,
    images: uploadedImages,
    videoUrl,
    logicSnippet,
    isActive: isActive !== undefined ? isActive : true,
  });

  return newKnowledge;
};

export const updateKnowledgeContent = async ({ id, body, files }) => {
  const knowledge = await Knowledge.findById(id);
  if (!knowledge) throw new Error("Knowledge not found");

  const { title, category, shortDescription, fullContent, logicSnippet, isActive, existingImages } = body;

  // ✅ Manage Images
  let finalImages = [];
  if (existingImages) {
    finalImages = typeof existingImages === "string" ? JSON.parse(existingImages) : existingImages;
  }

  // Delete removed images from Cloudinary
  const removedImages = knowledge.images.filter(
    (oldImg) => !finalImages.some((img) => img.publicId === oldImg.publicId)
  );
  for (const img of removedImages) {
    await cloudinaryDelete(img.publicId);
  }

  // Upload new images
  const newFiles = files?.images || [];
  for (const file of newFiles) {
    const result = await cloudinaryUpload(file.path, `knowledge-${Date.now()}`, "portfoliov2/knowledge");
    finalImages.push({ url: result.secure_url, publicId: result.public_id });
  }

  // ✅ Update fields
  knowledge.title = title ?? knowledge.title;
  knowledge.category = category ?? knowledge.category;
  knowledge.shortDescription = shortDescription ?? knowledge.shortDescription;
  knowledge.fullContent = fullContent ?? knowledge.fullContent;
  knowledge.logicSnippet = logicSnippet ?? knowledge.logicSnippet;
  knowledge.images = finalImages;
  knowledge.isActive = isActive !== undefined ? isActive : knowledge.isActive;

  // Video handle
  if (files?.video?.[0]) {
    const videoResult = await cloudinaryUpload(files.video[0].path, `video-${Date.now()}`, "portfoliov2/knowledge/videos");
    knowledge.videoUrl = videoResult.secure_url;
  } else if (body.videoUrl) {
    knowledge.videoUrl = body.videoUrl;
  }

  await knowledge.save();
  return knowledge;
};

export const getAllKnowledgeService = async ({ page = 1, limit = 10, category, search }) => {
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: "i" };

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const total = await Knowledge.countDocuments(filter);
  const data = await Knowledge.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return { data, total, page: pageNumber, limit: limitNumber };
};

export const getSingleKnowledgeService = async ({ id }) => {
  const knowledge = await Knowledge.findById(id);
  if (!knowledge) throw new Error("Knowledge not found");
  return knowledge;
};

export const deleteKnowledgeService = async ({ id }) => {
  const knowledge = await Knowledge.findById(id);
  if (!knowledge) throw new Error("Knowledge not found");

  for (const img of knowledge.images) {
    await cloudinaryDelete(img.publicId);
  }
  await Knowledge.findByIdAndDelete(id);
  return true;
};