import express from "express";
import { createCollection, updateCollection, deleteCollection } from "./foods.controllers";

import { verifyUser } from "../../middleware/verifyUsers";
import upload from "../../config/multer.config";

const router = express.Router();

router.post("/", verifyUser('ADMIN'), upload.single("image"), createCollection);
router.patch("/:id", verifyUser('ADMIN'), upload.single("image"), updateCollection);
router.delete("/:id", verifyUser('ADMIN'), deleteCollection);

export default router;
