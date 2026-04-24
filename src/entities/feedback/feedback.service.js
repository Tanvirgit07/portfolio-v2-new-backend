import { createPaginationInfo } from "../../lib/pagination.js";
import feedbackModel from "./feedback.model.js";

export const createFeedbackService = async (body) => {
  const { status, message, name, role } = body;

  const feedback = await feedbackModel.create({
    status,
    message,
    name,
    role,
  });

  return feedback;
};

export const getAllFeedbackService = async ({
  page = 1,
  limit = 10,
  status,
  isActive,
}) => {
  const filter = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  if (status) {
    filter.status = status;
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const total = await feedbackModel.countDocuments(filter);

  const feedbacks = await feedbackModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    feedbacks,
    paginationInfo: createPaginationInfo(
      pageNumber,
      limitNumber,
      total
    ),
  };
};

export const getSingleFeedbackService = async ({ id }) => {
  const feedback = await feedbackModel.findById(id);

  if (!feedback) {
    throw new Error("Feedback not found");
  }

  return feedback;
};

export const deleteFeedbackService = async ({ id }) => {
  const feedback = await feedbackModel.findByIdAndDelete(id);

  if (!feedback) {
    throw new Error("Feedback not found");
  }

  return feedback;
};