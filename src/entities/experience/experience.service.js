import { createPaginationInfo } from "../../lib/pagination.js";
import Experience from "./experience.model.js";

export const createExperienceService = async (body) => {
  const {
    position,
    company,
    location,
    duration,
    description,
    side,
    achievements,
  } = body;

  let parsedAchievements = [];

  try {
    parsedAchievements =
      typeof achievements === "string"
        ? JSON.parse(achievements)
        : achievements || [];
  } catch {
    throw new Error("Invalid achievements format");
  }

  const exp = await Experience.create({
    position,
    company,
    location,
    duration,
    description,
    side,
    achievements: parsedAchievements,
  });

  return exp;
};

export const updateExperienceService = async ({ id, body }) => {
  const exp = await Experience.findById(id);

  if (!exp) {
    throw new Error("Experience not found");
  }

  const {
    position,
    company,
    location,
    duration,
    description,
    side,
    achievements,
    isActive,
  } = body;

  let parsedAchievements = exp.achievements;

  if (achievements) {
    try {
      parsedAchievements =
        typeof achievements === "string"
          ? JSON.parse(achievements)
          : achievements;
    } catch {
      throw new Error("Invalid achievements format");
    }
  }

  exp.position = position ?? exp.position;
  exp.company = company ?? exp.company;
  exp.location = location ?? exp.location;
  exp.duration = duration ?? exp.duration;
  exp.description = description ?? exp.description;
  exp.side = side ?? exp.side;
  exp.achievements = parsedAchievements;
  exp.isActive = isActive ?? exp.isActive;

  await exp.save();

  return exp;
};

export const getAllExperienceService = async ({
  page = 1,
  limit = 10,
  search,
  company,
  isActive,
}) => {
  const filter = {};

  // ✅ active filter
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  // ✅ company filter
  if (company) {
    filter.company = { $regex: company, $options: "i" };
  }

  // ✅ search (position + company)
  if (search) {
    filter.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const total = await Experience.countDocuments(filter);

  const experiences = await Experience.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    experiences,
    paginationInfo: createPaginationInfo(
      pageNumber,
      limitNumber,
      total
    ),
  };
};

export const getSingleExperienceService = async ({ id }) => {
  const exp = await Experience.findById(id);

  if (!exp) {
    throw new Error("Experience not found");
  }

  return exp;
};

export const deleteExperienceService = async ({ id }) => {
  const exp = await Experience.findByIdAndDelete(id);

  if (!exp) {
    throw new Error("Experience not found");
  }

  return exp;
};