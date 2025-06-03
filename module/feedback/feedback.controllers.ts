import fs from "fs";
import path from "path";
import { baseUrl, getImageUrl } from "../../utils/base_utl";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// model feedback {
//   id          String   @id @default(cuid())
//   name        String
//   email       String
//   description String
//   createdAt   DateTime @default(now())
// }

export const createFeedback = async (req, res) => {
  try {
    const { name, email, description } = req.body;

    const missingField = ["name", "email", "description"].find(
      (field) => !req.body[field]
    );
    if (missingField) {
      res.status(400).json({ message: `${missingField} is required!` });
      return;
    }
    const newFeedback = await prisma.feedback.create({
      data: {
        name,
        email,
        description,
      },
    });
    if (!newFeedback) {
      res.status(400).json({ message: "Failed to create feedback" });
      return;
    }
    res.status(201).json({
      message: "Feedback created successfully",
      data: newFeedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};





export const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      total: feedbackList.length,
      data: feedbackList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.feedback.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await prisma.feedback.delete({ where: { id } });

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};