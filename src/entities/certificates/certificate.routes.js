import express from "express";
import { multerUpload } from "../../core/middlewares/multer.js";
import {
  createCertificate,
  deleteCertificate,
  getAllCertificates,
  getSingleCertificate,
  updateCertificate,
} from "./certificate.controller.js";

const router = express.Router();

const uploadMiddleware = multerUpload([
  { name: "certificateImage", maxCount: 1 },
  { name: "issuerLogo", maxCount: 1 },
]);

router.post("/createCertificate", uploadMiddleware, createCertificate);
router.put("/updateCertificate/:id", uploadMiddleware, updateCertificate);
router.get("/getallCertificate", getAllCertificates);
router.get("/getsingleCertificate/:id", getSingleCertificate);
router.delete("/deleteCertificate/:id", deleteCertificate);

export default router;

