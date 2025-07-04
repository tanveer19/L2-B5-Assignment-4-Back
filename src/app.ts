import express, { Application, Request, Response } from "express";
import cors from "cors";
import { booksRoutes } from "./app/controllers/books.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173", // ⬅️ allow  Vite frontend
    credentials: true, // optional if you’re sending cookies or auth headers
  })
);

app.use(express.json());

app.use("/api/books", booksRoutes);

app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library App");
});

export default app;
