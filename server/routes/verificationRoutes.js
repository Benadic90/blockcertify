import express from "express";

import {
  verifyByCertificateId,
  verifyByHash,
  verifyByUpload
} from "../controllers/verificationController.js";
import { uploadCertificate } from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/upload",
  uploadCertificate.single("certificatePdf"),
  asyncHandler(verifyByUpload)
);
router.get("/:certificateId", asyncHandler(verifyByCertificateId));
router.post("/hash", asyncHandler(verifyByHash));

export default router;
