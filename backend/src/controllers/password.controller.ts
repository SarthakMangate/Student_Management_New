import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import pool from "../config/db";

/**
 * FORGOT PASSWORD
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const user = await pool.query(
      `UPDATE users
       SET reset_token=$1, reset_token_expiry=$2
       WHERE email=$3
       RETURNING id`,
      [token, expiry, email]
    );

    // Do not reveal whether user exists
    if (user.rowCount === 0) {
      return res.json({ message: "If email exists, reset link sent" });
    }

    // ⚠️ For college project only
    return res.json({
      message: "Password reset token generated",
      resetToken: token
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * RESET PASSWORD
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
      `
      UPDATE users
      SET password=$1,
          reset_token=NULL,
          reset_token_expiry=NULL
      WHERE reset_token=$2
        AND reset_token_expiry > NOW()
      `,
      [hashed, token]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
