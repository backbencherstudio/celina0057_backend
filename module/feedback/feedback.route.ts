import express from "express";
import {
  createFeedback,
  getAllFeedback,
  deleteFeedback,
} from "./feedback.controllers";

import { verifyUser } from "../../middleware/verifyUsers";

const router = express.Router();

router.post("/", createFeedback);
router.get("/", verifyUser("ADMIN"), getAllFeedback);
router.delete("/:id", verifyUser("ADMIN"), deleteFeedback);

export default router;
