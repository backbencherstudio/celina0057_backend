import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import admin from "./module/admin/admin.routes";
import foods from "./module/foods/foods.routes";
import feedback from "./module/feedback/feedback.route";
import legalDocument from "./module/legalDocument/legalDocument.routes";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://v0-recreate-ui-from-screenshot-gules-seven-93.vercel.app",
      "https://celina0057-dashboard.vercel.app",
      "https://celina0057-dashboard-git-main-bbsfullstacks-projects.vercel.app",
    ],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/admin", admin);
app.use("/foods", foods);
app.use("/feedback", feedback);
app.use("/legal-document", legalDocument);
 
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
