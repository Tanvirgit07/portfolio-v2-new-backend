import { cloudinaryDelete } from "../../lib/cloudinaryDelete.js";
import { cloudinaryUpload } from "../../lib/cloudinaryUpload.js";
import { createPaginationInfo } from "../../lib/pagination.js";
import Project from "./project.model.js"; // adjust path

export const createProjectContent = async ({ body, files }) => {
  const {
    title,
    category,
    tags,
    description,
    logicSnippet,
    links,
    isActive,
  } = body;

  // ✅ Images (multiple required)
  const imageFiles = files?.images;

  if (!imageFiles || imageFiles.length === 0) {
    throw new Error("At least one image is required!");
  }

  const uploadedImages = [];

  for (const file of imageFiles) {
    const result = await cloudinaryUpload(
      file.path,
      `project-${Date.now()}`,
      "portfoliov2/projects"
    );

    if (!result?.secure_url) {
      throw new Error("image upload failed");
    }

    uploadedImages.push({
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  // ✅ Video (single optional)
  let videoData = null;

  const videoFile = files?.video?.[0];

  if (videoFile) {
    const videoResult = await cloudinaryUpload(
      videoFile.path,
      `video-${Date.now()}`,
      "portfoliov2/videos"
    );

    if (!videoResult?.secure_url) {
      throw new Error("video upload failed");
    }

    videoData = {
      url: videoResult.secure_url,
      publicId: videoResult.public_id,
    };
  }

  // ✅ Parse JSON fields
  let parsedTags = [];
  let parsedDescription = [];
  let parsedLinks = [];

  try {
    parsedTags =
      typeof tags === "string" ? JSON.parse(tags) : tags || [];

    parsedDescription =
      typeof description === "string"
        ? JSON.parse(description)
        : description || [];

    parsedLinks =
      typeof links === "string" ? JSON.parse(links) : links || [];
  } catch (err) {
    throw new Error("Invalid JSON format in tags/description/links");
  }

  // ✅ Create Project
  const newProject = await Project.create({
    title,
    category,
    images: uploadedImages,
    video: videoData,
    tags: parsedTags,
    description: parsedDescription,
    logicSnippet,
    links: parsedLinks,
    isActive: isActive !== undefined ? isActive : true,
  });

  return newProject;
};

export const updateProjectContent = async ({ id, body, files }) => {
  const project = await Project.findById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  const {
    title,
    category,
    tags,
    description,
    logicSnippet,
    links,
    isActive,
    existingImages, // frontend থেকে পাঠাবি (যেগুলো রাখতে চাস)
    removeVideo,    // true হলে video delete হবে
  } = body;

  // =========================
  // ✅ Handle Images
  // =========================

  let finalImages = [];

  // 👉 keep existing images
  if (existingImages) {
    try {
      const parsedExisting =
        typeof existingImages === "string"
          ? JSON.parse(existingImages)
          : existingImages;

      finalImages = parsedExisting;
    } catch {
      throw new Error("Invalid existingImages format");
    }
  }

  // 👉 delete removed images from cloudinary
  const oldImages = project.images || [];

  const removedImages = oldImages.filter(
    (oldImg) =>
      !finalImages.some((img) => img.publicId === oldImg.publicId)
  );

  for (const img of removedImages) {
    if (img.publicId) {
      await cloudinaryDelete(img.publicId);
    }
  }

  // 👉 upload new images
  const newImageFiles = files?.images || [];

  for (const file of newImageFiles) {
    const result = await cloudinaryUpload(
      file.path,
      `project-${Date.now()}`,
      "portfoliov2/projects"
    );

    if (!result?.secure_url) {
      throw new Error("image upload failed");
    }

    finalImages.push({
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  // =========================
  // ✅ Handle Video
  // =========================

  let finalVideo = project.video;

  // 👉 remove video যদি true আসে
  if (removeVideo === "true" || removeVideo === true) {
    if (project.video?.publicId) {
      await cloudinaryDelete(project.video.publicId);
    }
    finalVideo = null;
  }

  // 👉 নতুন video upload
  const videoFile = files?.video?.[0];

  if (videoFile) {
    // old delete
    if (project.video?.publicId) {
      await cloudinaryDelete(project.video.publicId);
    }

    const videoResult = await cloudinaryUpload(
      videoFile.path,
      `video-${Date.now()}`,
      "portfoliov2/videos"
    );

    if (!videoResult?.secure_url) {
      throw new Error("video upload failed");
    }

    finalVideo = {
      url: videoResult.secure_url,
      publicId: videoResult.public_id,
    };
  }

  let parsedTags = project.tags;
  let parsedDescription = project.description;
  let parsedLinks = project.links;

  try {
    if (tags) {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    }

    if (description) {
      parsedDescription =
        typeof description === "string"
          ? JSON.parse(description)
          : description;
    }

    if (links) {
      parsedLinks =
        typeof links === "string" ? JSON.parse(links) : links;
    }
  } catch {
    throw new Error("Invalid JSON format");
  }
  project.title = title ?? project.title;
  project.category = category ?? project.category;
  project.images = finalImages;
  project.video = finalVideo;
  project.tags = parsedTags;
  project.description = parsedDescription;
  project.logicSnippet = logicSnippet ?? project.logicSnippet;
  project.links = parsedLinks;
  project.isActive =
    isActive !== undefined ? isActive : project.isActive;

  await project.save();

  return project;
};

export const getAllProjectService = async ({
  page = 1,
  limit = 10,
  isActive,
  category,
  search,
}) => {
  const filter = {};

  // ✅ Active filter
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  // ✅ Category filter
  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  // ✅ Search by title
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const total = await Project.countDocuments(filter);

  const projects = await Project.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    projects,
    paginationInfo: createPaginationInfo(pageNumber, limitNumber, total),
  };
};

export const getSingleProjectService = async ({ id }) => {
  const project = await Project.findById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const deleteProjectService = async ({ id }) => {
  const project = await Project.findById(id);

  if (!project) {
    throw new Error("Project not found");
  }
  for (const img of project.images || []) {
    if (img.publicId) {
      await cloudinaryDelete(img.publicId, "image");
    }
  }
  if (project.video?.publicId) {
    await cloudinaryDelete(project.video.publicId, "video");
  }
  await Project.findByIdAndDelete(id);

  return project;
};