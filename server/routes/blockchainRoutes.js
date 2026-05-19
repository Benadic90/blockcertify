import express from "express";

import {
  issueOnBlockchain,
  revokeOnBlockchain,
  verifyOnBlockchain
} from "../controllers/blockchainController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/issue", protect, allowRoles("admin"), asyncHandler(issueOnBlockchain));
router.get("/verify/:certificateId/:hash", asyncHandler(verifyOnBlockchain));
router.put(
  "/revoke/:certificateId",
  protect,
  allowRoles("admin"),
  asyncHandler(revokeOnBlockchain)
);

export default router;
