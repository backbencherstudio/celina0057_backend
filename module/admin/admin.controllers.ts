import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { Request as ExpressRequest } from "express-serve-static-core";

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

    // const existingAdmin = await prisma.user.findUnique({ where: { email } });
    // if (existingAdmin) {
    //   res.status(400).json({ message: "Admin already exists" });
    //   return;
    // }

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
