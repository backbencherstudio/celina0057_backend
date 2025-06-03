import fs from "fs";
import path from "path";
import { baseUrl, getImageUrl } from "../../utils/base_utl";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const createCollection = async (req, res) => {
  try {
    const { name, category } = req.body;
    const missingField = ["name", "category"].find((field) => !req.body[field]);
    if (missingField) {
      res.status(400).json({ message: `${missingField} is required!` });
      return;
    }
    const imagePath = req.file ? req.file.filename : null;

    const newFood = await prisma.foods.create({
      data: {
        name,
        category,
        image: imagePath,
      },
    });
    if (!newFood) {
      res.status(400).json({ message: "Failed to create food collection" });
      return;
    }

    res.status(201).json({
      message: "Food collection created successfully",
      food: {
        id: newFood.id,
        name: newFood.name,
        category: newFood.category,
        image: newFood.image ? `${baseUrl}/uploads/${newFood.image}` : null,
        createdAt: newFood.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { name, category } = req.body;
    const foodId = req.params.id;

    const imagePath = req.file ? req.file.filename : null;

    const dataToUpdate = {
      ...(name && { name }),
      ...(category && { category }),
      ...(imagePath && { image: imagePath }),
    };

    const existingFood = await prisma.foods.findUnique({
      where: { id: foodId },
    });
    if (!existingFood) {
      return res.status(404).json({ message: "Food collection not found" });
    }

    const updatedFood = await prisma.foods.update({
      where: { id: foodId },
      data: dataToUpdate,
    });

    if (imagePath && existingFood.image) {
      const oldImagePath = path.join(
        __dirname,
        "../../uploads",
        existingFood.image
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    res.status(200).json({
      message: "Food collection updated successfully",
      data: {
        id: updatedFood.id,
        name: updatedFood.name,
        category: updatedFood.category,
        image: updatedFood.image
          ? `${baseUrl}/uploads/${updatedFood.image}`
          : null,
        createdAt: updatedFood.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const foodId = req.params.id;
    const existingFood = await prisma.foods.findUnique({
      where: { id: foodId },
    });
    if (!existingFood) {
      return res.status(404).json({ message: "Food collection not found" });
    }

    const deletedFood = await prisma.foods.delete({
      where: { id: foodId },
    });

    

    if (deletedFood && existingFood.image) {
      const oldImagePath = path.join(
        __dirname,
        "../../uploads",
        existingFood.image
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    res.status(200).json({
      success: true,
      message: "Food collection deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
