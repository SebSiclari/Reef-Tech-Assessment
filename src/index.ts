import { prisma } from "./utils/db";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// Initialize database connection
prisma
  .$connect()
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
