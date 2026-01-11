import { Request, Response } from "express";
import  pool  from "../config/db";

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users"
    );
    res.json(result.rows); // ARRAY
  } catch (err) {
    res.status(500).json({ message: "Failed to load users" });
  }
};
