import express from "express";
import { syncUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/sync/:username", syncUser);

export default router;
