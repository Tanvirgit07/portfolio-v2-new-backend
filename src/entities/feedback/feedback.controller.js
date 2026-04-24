import { generateResponse } from "../../lib/responseFormate.js";
import { createFeedbackService, deleteFeedbackService, getAllFeedbackService, getSingleFeedbackService } from "./feedback.service.js";

export const createFeedback = async (req, res, next) => {
  try {
    const data = await createFeedbackService(req.body);

    return generateResponse(
      res,
      201,
      true,
      "Feedback submitted successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const getAllFeedback = async (req, res, next) => {
  try {
    const data = await getAllFeedbackService(req.query);

    return generateResponse(
      res,
      200,
      true,
      "Feedback fetched successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleFeedback = async (req, res, next) => {
  try {
    const data = await getSingleFeedbackService(req.params);

    return generateResponse(
      res,
      200,
      true,
      "Feedback fetched successfully",
      data
    );
  } catch (error) {
    if (error.message === "Feedback not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    await deleteFeedbackService(req.params);

    return generateResponse(
      res,
      200,
      true,
      "Feedback deleted successfully"
    );
  } catch (error) {
    if (error.message === "Feedback not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};