import express from "express";
import { createAdmin } from "./admin.controllers";

import { verifyUser } from "../../middleware/verifyUsers";
import upload from "../../config/multer.config";
const router = express.Router();

router.post("/", upload.single("image"), createAdmin);

export default router;
