import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { baseUrl, getImageUrl } from "../../utils/base_utl";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const missingField = ["name", "email", "password"].find(
      (field) => !req.body[field]
    );
    if (missingField) {
      res.status(400).json({ message: `${missingField} is required!` });
      return;
    }

    const existingAdmin = await prisma.user.findUnique({ where: { email } });
    if (existingAdmin) {
      res.status(400).json({ message: "Admin already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const imagePath = req.file ? req.file.filename : null;

    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: imagePath,
        role: "ADMIN",
      },
    });

    // res.status(201).json({
    //   message: "Admin created successfully",
    //   user: {
    //     ...newAdmin,
    //     image: newAdmin.image ? getImageUrl(newAdmin.image) : null,
    //   },
    // });

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        image: newAdmin.image ? `${baseUrl}/uploads/${newAdmin.image}` : null,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const missingField = ["email", "password"].find(
      (field) => !req.body[field]
    );

    if (missingField) {
      res.status(400).json({ message: `${missingField} is required!` });
      return;
    }

    const admin = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        image: true,
        role: true,
      },
    });

    if (!admin) {
      res.status(404).json({ message: "entity not found" });
      return;
    }

    if (admin.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1y" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        image: admin.image ? `${baseUrl}/uploads/${admin.image}` : null,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.user;
    const { name } = req.body;

    if (!id) {
      res.status(400).json({
        message: "header এর মধ্যে Authorization টোকেন দেন!",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        message: "Admin not found",
      });
      return;
    }

    const updatedData: any = {};
    if (name) updatedData.name = name;
  
 
    if (req.file) {
      const oldImagePath = existingUser.image
        ? path.join(__dirname, "../../uploads", existingUser.image)
        : null;
      if (oldImagePath && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      updatedData.image = req.file.filename;
    }
    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: updatedData,
    });


    res.status(200).json({
      message: "Admin updated successfully",
      user: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        image: updatedAdmin.image? `${baseUrl}/uploads/${updatedAdmin.image}`: null,
        role: updatedAdmin.role,
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
