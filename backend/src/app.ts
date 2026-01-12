import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import passwordRoutes from "./routes/password.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

// 1. Updated CORS to explicitly allow your frontend port
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 2. Updated Routes: Moved /ai under /api/ai for consistency
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/ai", aiRoutes); // Changed from "/ai" to "/api/ai"

// Test route
app.get("/", (_, res) => res.send("Student Management API running"));

export default app;