import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import passwordRoutes from "./routes/password.routes";
import path from "path";

const app = express();

// ✅ Apply middlewares BEFORE routes
app.use(cors());
app.use(express.json());

// ✅ serve images
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);


// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/password", passwordRoutes);

// Test endpoint
app.get("/", (_, res) => {
  res.send("Student Management API (TS) running");
});

export default app;
