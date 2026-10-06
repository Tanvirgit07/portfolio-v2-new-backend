import { cloudinaryUpload } from "../../lib/cloudinaryUpload.js";
import { createPaginationInfo } from "../../lib/pagination.js";
import Certificate from "./certificate.model.js";

// Helper to parse skills from string / JSON / array
const parseSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  if (typeof skills === "string") {
    try {
      const parsed = JSON.parse(skills);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // If it's comma-separated or plain text
      return skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

export const createCertificateService = async ({ body, files }) => {
  const {
    title,
    issuer,
    issueDate,
    credentialId,
    verificationUrl,
    description,
    order,
    isActive,
    skills,
  } = body;

  let certificateImageUrl = body.certificateImage || "";
  let issuerLogoUrl = body.issuerLogo || "";

  // 1. Upload certificate image if provided via file
  const certificateFile = files?.certificateImage?.[0];
  if (certificateFile) {
    const uploadResult = await cloudinaryUpload(
      certificateFile.path,
      `cert-${Date.now()}`,
      "portfoliov2/certificates"
    );
    if (uploadResult?.secure_url) {
      certificateImageUrl = uploadResult.secure_url;
    }
  }

  // 2. Upload issuer logo if provided via file
  const logoFile = files?.issuerLogo?.[0];
  if (logoFile) {
    const logoResult = await cloudinaryUpload(
      logoFile.path,
      `issuer-${Date.now()}`,
      "portfoliov2/issuers"
    );
    if (logoResult?.secure_url) {
      issuerLogoUrl = logoResult.secure_url;
    }
  }

  // 3. Create document in MongoDB
  const newCertificate = await Certificate.create({
    title,
    issuer,
    issuerLogo: issuerLogoUrl,
    certificateImage: certificateImageUrl,
    issueDate,
    credentialId: credentialId || "",
    verificationUrl: verificationUrl || "",
    skills: parseSkills(skills),
    description: description || "",
    order: order !== undefined ? Number(order) : 0,
    isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
  });

  return newCertificate;
};

export const updateCertificateService = async ({ id, body, files }) => {
  const existingCert = await Certificate.findById(id);
  if (!existingCert) {
    throw new Error("Certificate not found");
  }

  const {
    title,
    issuer,
    issueDate,
    credentialId,
    verificationUrl,
    description,
    order,
    isActive,
    skills,
    certificateImage,
    issuerLogo,
  } = body;

  let certificateImageUrl = certificateImage !== undefined ? certificateImage : existingCert.certificateImage;
  let issuerLogoUrl = issuerLogo !== undefined ? issuerLogo : existingCert.issuerLogo;

  // Upload new certificate image if passed
  const certificateFile = files?.certificateImage?.[0];
  if (certificateFile) {
    const uploadResult = await cloudinaryUpload(
      certificateFile.path,
      `cert-${Date.now()}`,
      "portfoliov2/certificates"
    );
    if (uploadResult?.secure_url) {
      certificateImageUrl = uploadResult.secure_url;
    }
  }

  // Upload new issuer logo if passed
  const logoFile = files?.issuerLogo?.[0];
  if (logoFile) {
    const logoResult = await cloudinaryUpload(
      logoFile.path,
      `issuer-${Date.now()}`,
      "portfoliov2/issuers"
    );
    if (logoResult?.secure_url) {
      issuerLogoUrl = logoResult.secure_url;
    }
  }

  existingCert.title = title ?? existingCert.title;
  existingCert.issuer = issuer ?? existingCert.issuer;
  existingCert.issueDate = issueDate ?? existingCert.issueDate;
  existingCert.credentialId = credentialId !== undefined ? credentialId : existingCert.credentialId;
  existingCert.verificationUrl = verificationUrl !== undefined ? verificationUrl : existingCert.verificationUrl;
  existingCert.description = description !== undefined ? description : existingCert.description;
  existingCert.order = order !== undefined ? Number(order) : existingCert.order;
  existingCert.certificateImage = certificateImageUrl;
  existingCert.issuerLogo = issuerLogoUrl;

  if (isActive !== undefined) {
    existingCert.isActive = isActive === "true" || isActive === true;
  }

  if (skills !== undefined) {
    existingCert.skills = parseSkills(skills);
  }

  await existingCert.save();
  return existingCert;
};

export const getAllCertificateService = async ({
  page = 1,
  limit = 100,
  search,
  issuer,
  isActive,
}) => {
  const filter = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  if (issuer) {
    filter.issuer = { $regex: issuer, $options: "i" };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { issuer: { $regex: search, $options: "i" } },
      { credentialId: { $regex: search, $options: "i" } },
      { skills: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 100;

  const total = await Certificate.countDocuments(filter);

  const certificates = await Certificate.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    certificates,
    paginationInfo: createPaginationInfo(
      pageNumber,
      limitNumber,
      total
    ),
  };
};

export const getSingleCertificateService = async ({ id }) => {
  const cert = await Certificate.findById(id);
  if (!cert) {
    throw new Error("Certificate not found");
  }
  return cert;
};

export const deleteCertificateService = async ({ id }) => {
  const cert = await Certificate.findByIdAndDelete(id);
  if (!cert) {
    throw new Error("Certificate not found");
  }
  return cert;
};

