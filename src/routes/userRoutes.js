import express from "express";
import {
  getAllUsers,
  getAnalyticsSummary,
  getLocalUser,
  getTopInfluencers,
  searchUsers,
  syncUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/sync/:username", syncUser);
router.get("/", getAllUsers);
router.get("/local/:username", getLocalUser);
router.get("/analytics/summary", getAnalyticsSummary);
router.get("/top/influencers", getTopInfluencers);
router.get("/search", searchUsers);

export default router;
