import express from "express";

import {
  addStudent,
  getDashboardSummary,
  getIssuedCertificates,
  getStudents,
  issueCertificate,
  revokeCertificate
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { uploadCertificate } from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/dashboard", asyncHandler(getDashboardSummary));
router.post("/students", asyncHandler(addStudent));
router.get("/students", asyncHandler(getStudents));
router.post(
  "/certificates/issue",
  uploadCertificate.single("certificatePdf"),
  asyncHandler(issueCertificate)
);
router.get("/certificates", asyncHandler(getIssuedCertificates));
router.put("/certificates/:id/revoke", asyncHandler(revokeCertificate));

export default router;
