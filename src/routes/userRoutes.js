import express from "express";
import {
  getAllUsers,
  getLocalUser,
  syncUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/sync/:username", syncUser);
router.get("/", getAllUsers);
router.get("/local/:username", getLocalUser);

export default router;
