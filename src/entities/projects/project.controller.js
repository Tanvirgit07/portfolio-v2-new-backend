import { generateResponse } from "../../lib/responseFormate.js";
import { createProjectContent, deleteProjectService, getAllProjectService, getSingleProjectService, updateProjectContent } from "./project.service.js";

export const createProject = async (req, res, next) => {
  try {
    const payload = req.body.data ? JSON.parse(req.body.data) : req.body;

    const data = await createProjectContent({
      body: payload,
      files: req.files,
    });

    generateResponse(
      res,
      201,
      true,
      "Project created successfully!",
      data
    );
  } catch (error) {
    if (error.message === "At least one image is required!") {
      return generateResponse(res, 400, false, error.message, null);
    }

    if (error.message === "image upload failed") {
      return generateResponse(res, 400, false, error.message, null);
    }

    if (error.message === "video upload failed") {
      return generateResponse(res, 400, false, error.message, null);
    }

    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const payload = req.body.data ? JSON.parse(req.body.data) : req.body;
    console.log(payload);
    console.log(req.files)

    const data = await updateProjectContent({
      id: req.params.id,
      body: payload,
      files: req.files,
    });

    generateResponse(
      res,
      200,
      true,
      "Project updated successfully!",
      data
    );
  } catch (error) {
    if (error.message === "Project not found") {
      return generateResponse(res, 404, false, error.message, null);
    }

    if (error.message === "image upload failed") {
      return generateResponse(res, 400, false, error.message, null);
    }

    if (error.message === "video upload failed") {
      return generateResponse(res, 400, false, error.message, null);
    }

    next(error);
  }
};

export const getAllProject = async (req, res, next) => {
  try {
    const data = await getAllProjectService(req.query);

    return generateResponse(
      res,
      200,
      true,
      "Project list fetched successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleProject = async (req, res, next) => {
  try {
    const data = await getSingleProjectService(req.params);

    return generateResponse(
      res,
      200,
      true,
      "Project fetched successfully",
      data
    );
  } catch (error) {
    if (error.message === "Project not found") {
      return generateResponse(res, 404, false, error.message, null);
    }

    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await deleteProjectService(req.params);

    return generateResponse(
      res,
      200,
      true,
      "Project deleted successfully"
    );
  } catch (error) {
    if (error.message === "Project not found") {
      return generateResponse(res, 404, false, error.message, null);
    }

    next(error);
  }
};