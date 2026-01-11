import { Router } from "express";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller";
import protect from "../middleware/auth.middleware";
import { upload } from "../config/upload";

const router = Router();

router.get("/", getStudents);
router.post("/", protect, upload.single("image"), createStudent);
router.put("/:id", protect, upload.single("image"), updateStudent);
router.delete("/:id", protect, deleteStudent);

export default router;
