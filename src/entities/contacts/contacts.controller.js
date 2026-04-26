import { generateResponse } from "../../lib/responseFormate.js";
import { createContactService, deleteContactService, getAllContactService, getSingleContactService } from "./contacts.service.js";

export const createContact = async (req, res, next) => {
  try {
    const data = await createContactService(req.body);

    return generateResponse(
      res,
      201,
      true,
      "Message sent successfully!",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const getAllContact = async (req, res, next) => {
  try {
    const data = await getAllContactService(req.query);

    return generateResponse(
      res,
      200,
      true,
      "Contact messages fetched successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleContact = async (req, res, next) => {
  try {
    const data = await getSingleContactService(req.params);

    return generateResponse(
      res,
      200,
      true,
      "Contact message fetched successfully",
      data
    );
  } catch (error) {
    if (error.message === "Message not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    await deleteContactService(req.params);

    return generateResponse(
      res,
      200,
      true,
      "Contact message deleted successfully"
    );
  } catch (error) {
    if (error.message === "Message not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};