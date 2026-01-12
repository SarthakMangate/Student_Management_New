import { Router } from "express";
import askAI from "../services/askAI";
import { buildContext } from "../services/buildContext";

const router = Router();

router.post("/ask", async (req, res) => {
  const { question, history } = req.body;

  if (!question) return res.status(400).json({ error: "Please ask a question." });

  try {
    const context = await buildContext();
    const result = await askAI(question, context, history || []);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "The AI service failed." });
  }
});

export default router;