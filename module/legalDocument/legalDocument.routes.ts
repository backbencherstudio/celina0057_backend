import express from "express";
import {
  getLegalDocument,
  deleteLegalDocument,
  saveLegalDocument,
} from "./legalDocument.controllers"
import { verifyUser } from "../../middleware/verifyUsers";

const router = express.Router();

router.get("/", getLegalDocument);
router.post("/",  verifyUser('ADMIN'), saveLegalDocument);
router.delete("/:id",  verifyUser('ADMIN'), deleteLegalDocument);

export default router;
