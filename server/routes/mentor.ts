import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import { db } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new Groq({ apiKey });
}

// POST /api/mentor/chat
router.post("/chat", authenticate, async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const systemInstruction = `You are NexMentor, an elite AI Career, Software Engineering, and Tech Interview Mentor powering NexHire.
Your mission is to guide software engineers, students, and job seekers to land top tech roles.
You excel at:
- Data Structures & Algorithms (DSA): Time/space complexity analysis, edge cases, step-by-step problem-solving, clean code.
- System Design & Architecture: Distributed systems, caching strategies, database design, API design, scalability.
- Code Review & Debugging: Refactoring, performance optimization, best practices in TypeScript, React, Node.js, Python, Go, Java, C++.
- Tech Career Strategy: Resume optimization, ATS keyword targeting, salary negotiation, STAR behavioral responses.

Guidelines:
- Provide clear, well-structured, production-ready responses using markdown formatting.
- Include executable code blocks with exact language specifications when providing code.
- Be encouraging, highly technical, concise, and direct.`;

    const formattedHistory = messages.map((m: any) => ({
      role: m.role === "assistant" || m.role === "ai" ? "assistant" : "user",
      content: typeof m === "string" ? m : m.content || m.text || ""
    }));

    let reply = "";

    // 1. Try Groq AI (Llama 3.3 70B)
    const groq = getGroqClient();
    if (groq) {
      try {
        const groqCompletion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemInstruction },
            ...formattedHistory.map((m) => ({
              role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
              content: m.content
            }))
          ],
          temperature: 0.5,
          max_tokens: 2048
        });

        reply = groqCompletion.choices[0]?.message?.content || "";
      } catch (groqErr) {
        console.warn("Groq AI failed for NexMentor, falling back to Gemini:", groqErr);
      }
    }

    // 2. Fallback to Gemini AI if Groq wasn't available or failed
    if (!reply) {
      const gemini = getGeminiClient();
      if (gemini) {
        const lastMsg = formattedHistory[formattedHistory.length - 1]?.content || "Hello NexMentor";
        const response = await gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: lastMsg,
          config: {
            systemInstruction
          }
        });
        reply = response.text || "";
      }
    }

    if (!reply) {
      reply = "I am ready to help you with DSA, System Design, Code Optimization, and Interview Strategy! Ask me your question.";
    }

    res.json({
      success: true,
      message: {
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error("NexMentor chat error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat message" });
  }
});

export default router;
