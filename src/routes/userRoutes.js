import express from "express";

import {
  syncUser,
  getAllUsers,
  getLocalUser,
  getAnalyticsSummary,
  getTopInfluencers,
  searchUsers,
} from "../controllers/userController.js";

import validateRequest from "../middleware/validateRequest.js";

import {
  usernameParamsSchema,
  limitQuerySchema,
  languageQuerySchema,
} from "../utils/validateUser.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post(
  "/sync/:username",
  validateRequest(usernameParamsSchema, "params"),
  syncUser,
);

router.get(
  "/local/:username",
  validateRequest(usernameParamsSchema, "params"),
  getLocalUser,
);

router.get("/analytics", getAnalyticsSummary);

router.get(
  "/top",
  validateRequest(limitQuerySchema, "query"),
  getTopInfluencers,
);

router.get(
  "/search",
  validateRequest(languageQuerySchema, "query"),
  searchUsers,
);

export default router;
