import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getLegalDocument = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    const doc = await prisma.legalDocument.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!doc) {
      res.status(404).json({
        success: false,
        message: "No legal document found",
      });
      return;
    }

    if (type === "privacy") {
      res.status(200).json({
        success: true,
        data: {
          privacyPolicy: doc.privacyPolicy,
        },
      });
      return;
    }

    if (type === "terms") {
      res.status(200).json({
        success: true,
        data: {
          termsConditions: doc.termsConditions,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        privacyPolicy: doc.privacyPolicy,
        termsConditions: doc.termsConditions,
      },
    });
  } catch (error) {
    console.error("Error fetching legal document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const saveLegalDocument = async (req: Request, res: Response) => {
  try {
    const { privacyPolicy, termsConditions } = req.body;

    const existingDoc = await prisma.legalDocument.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const doc = await prisma.legalDocument.upsert({
      where: {
        id: existingDoc?.id ?? "placeholder-id",
      },
      update: {
        privacyPolicy,
        termsConditions,
      },
      create: {
        privacyPolicy,
        termsConditions,
      },
    });

    res.status(existingDoc ? 200 : 201).json({
      success: true,
      message: existingDoc
        ? "Legal document updated successfully"
        : "Legal document created successfully",
      data: doc,
    });
  } catch (error) {
    console.error("Error saving legal document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLegalDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.legalDocument.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    await prisma.legalDocument.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Legal document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting legal document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
