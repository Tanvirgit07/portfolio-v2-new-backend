import { generateResponse } from "../../lib/responseFormate.js";
import {
  createCertificateService,
  deleteCertificateService,
  getAllCertificateService,
  getSingleCertificateService,
  updateCertificateService,
} from "./certificate.service.js";

export const createCertificate = async (req, res, next) => {
  try {
    const data = await createCertificateService({
      body: req.body,
      files: req.files,
    });

    return generateResponse(
      res,
      201,
      true,
      "Certificate created successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const updateCertificate = async (req, res, next) => {
  try {
    const data = await updateCertificateService({
      id: req.params.id,
      body: req.body,
      files: req.files,
    });

    return generateResponse(
      res,
      200,
      true,
      "Certificate updated successfully",
      data
    );
  } catch (error) {
    if (error.message === "Certificate not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

export const getAllCertificates = async (req, res, next) => {
  try {
    const data = await getAllCertificateService(req.query);

    return generateResponse(
      res,
      200,
      true,
      "Certificates fetched successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleCertificate = async (req, res, next) => {
  try {
    const data = await getSingleCertificateService(req.params);

    return generateResponse(
      res,
      200,
      true,
      "Certificate fetched successfully",
      data
    );
  } catch (error) {
    if (error.message === "Certificate not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

export const deleteCertificate = async (req, res, next) => {
  try {
    await deleteCertificateService(req.params);

    return generateResponse(
      res,
      200,
      true,
      "Certificate deleted successfully"
    );
  } catch (error) {
    if (error.message === "Certificate not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

