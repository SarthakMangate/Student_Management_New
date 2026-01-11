import { Request, Response } from "express";
import pool from "../config/db";

export const getStudents = async (_: Request, res: Response) => {
  const result = await pool.query(
    `SELECT s.*, u.name AS owner_name
     FROM students s
     JOIN users u ON s.created_by = u.id
     ORDER BY s.created_at DESC`
  );
  res.json(result.rows);
};

export const createStudent = async (req: Request, res: Response) => {
  const { name, age, email, phone, gender, course, address } = req.body;

  const image = req.file
    ? `/uploads/students/${req.file.filename}`
    : null;

  await pool.query(
    `INSERT INTO students
     (name, age, email, phone, gender, course, address, image, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [name, age, email, phone, gender, course, address, image, req.user!.id]
  );

  res.json({ message: "Student added" });
};

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  const owner = await pool.query(
    "SELECT created_by, image FROM students WHERE id=$1",
    [id]
  );

  if (!owner.rowCount) {
    return res.status(404).json({ message: "Not found" });
  }

  if (owner.rows[0].created_by !== req.user!.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const image = req.file
    ? `/uploads/students/${req.file.filename}`
    : owner.rows[0].image;

  const { name, age, email, phone, gender, course, address } = req.body;

  await pool.query(
    `UPDATE students
     SET name=$1, age=$2, email=$3, phone=$4,
         gender=$5, course=$6, address=$7, image=$8
     WHERE id=$9`,
    [name, age, email, phone, gender, course, address, image, id]
  );

  res.json({ message: "Updated" });
};

export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  const owner = await pool.query(
    "SELECT created_by FROM students WHERE id=$1",
    [id]
  );

  if (owner.rows[0].created_by !== req.user!.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await pool.query("DELETE FROM students WHERE id=$1", [id]);

  res.json({ message: "Deleted" });
};
