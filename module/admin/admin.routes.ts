import express from "express";
import { createAdmin, login, updateAdmin } from "./admin.controllers";

import { verifyUser } from "../../middleware/verifyUsers";
import upload from "../../config/multer.config";
const router = express.Router();

router.post("/", upload.single("image"), createAdmin);
router.post("/login", login);
router.patch("/", verifyUser('ADMIN'), upload.single("image"), updateAdmin);

export default router;
