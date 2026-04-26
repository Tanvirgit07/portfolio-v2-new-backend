import { generateResponse } from "../../lib/responseFormate.js";
import { createKnowledgeContent, deleteKnowledgeService, getAllKnowledgeService, getSingleKnowledgeService, updateKnowledgeContent } from "./knoledge.service.js";

export const createKnowledge = async (req, res, next) => {
  try {
    const payload = req.body.data ? JSON.parse(req.body.data) : req.body;

    const data = await createKnowledgeContent({
      body: payload,
      files: req.files,
    });

    generateResponse(res, 201, true, "Insight created successfully!", data);
  } catch (error) {
    const errorMessages = ["At least one image is required!", "image upload failed", "video upload failed"];
    if (errorMessages.includes(error.message)) {
      return generateResponse(res, 400, false, error.message, null);
    }
    next(error);
  }
};

export const updateKnowledge = async (req, res, next) => {
  try {
    const payload = req.body.data ? JSON.parse(req.body.data) : req.body;

    const data = await updateKnowledgeContent({
      id: req.params.id,
      body: payload,
      files: req.files,
    });

    generateResponse(res, 200, true, "Insight updated successfully!", data);
  } catch (error) {
    if (error.message === "Knowledge not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

export const getAllKnowledge = async (req, res, next) => {
  try {
    const data = await getAllKnowledgeService(req.query);
    generateResponse(res, 200, true, "Knowledge list fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

export const getSingleKnowledge = async (req, res, next) => {
  try {
    const data = await getSingleKnowledgeService(req.params);
    generateResponse(res, 200, true, "Knowledge fetched successfully", data);
  } catch (error) {
    if (error.message === "Knowledge not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

export const deleteKnowledge = async (req, res, next) => {
  try {
    await deleteKnowledgeService(req.params);
    generateResponse(res, 200, true, "Knowledge deleted successfully");
  } catch (error) {
    if (error.message === "Knowledge not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};