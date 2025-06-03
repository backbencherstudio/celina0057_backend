import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import admin from "./module/admin/admin.routes";
import foods from "./module/foods/foods.routes";

const app = express();

app.use(
  cors({
    origin: [
        "http://localhost:3000"
        
    ],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/admin", admin);
app.use("/foods", foods)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: `404 route not found`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: `500 Something broken!`,
    error: err.message,
  });
});

export default app;