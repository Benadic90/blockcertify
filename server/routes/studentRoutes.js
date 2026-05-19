import express from "express";

import { getStudentCertificates } from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/certificates",
  protect,
  allowRoles("student"),
  asyncHandler(getStudentCertificates)
);

export default router;
