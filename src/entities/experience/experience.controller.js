import { generateResponse } from "../../lib/responseFormate.js";
import { createExperienceService, deleteExperienceService, getAllExperienceService, getSingleExperienceService, updateExperienceService } from "./experience.service.js";

export const createExperience = async (req, res, next) => {
  try {
    const data = await createExperienceService(req.body);

    return generateResponse(
      res,
      201,
      true,
      "Experience created successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req, res, next) => {
  try {
    const data = await updateExperienceService({
      id: req.params.id,
      body: req.body,
    });

    return generateResponse(
      res,
      200,
      true,
      "Experience updated successfully",
      data
    );
  } catch (error) {
    if (error.message === "Experience not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

export const getAllExperience = async (req, res, next) => {
  try {
    const data = await getAllExperienceService(req.query);

    return generateResponse(
      res,
      200,
      true,
      "Experience fetched successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleExperience = async (req, res, next) => {
  try {
    const data = await getSingleExperienceService(req.params);

    return generateResponse(
      res,
      200,
      true,
      "Experience fetched successfully",
      data
    );
  } catch (error) {
    if (error.message === "Experience not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    await deleteExperienceService(req.params);

    return generateResponse(
      res,
      200,
      true,
      "Experience deleted successfully"
    );
  } catch (error) {
    if (error.message === "Experience not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};