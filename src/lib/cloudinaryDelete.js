import { v2 as cloudinary } from "cloudinary";

// ✅ Upload (already আছে ধরে নিচ্ছি)
export const cloudinaryUpload = async (filePath, publicId, folder) => {
  return await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    folder,
    resource_type: "auto",
  });
};

// ✅ Delete function (NEW)
export const cloudinaryDelete = async (publicId, resourceType = "image") => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};