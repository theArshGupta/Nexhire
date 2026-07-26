import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { InterviewController } from "../controllers/interviewController";
import { GoogleGenAI, Type } from "@google/genai";

const router = Router();

import { AIInterviewService } from "../services/aiInterviewService";

// --- NEW PRODUCTION NEXINTERVIEW PIPELINE ---
router.post("/start", authenticate, InterviewController.startInterview);
router.post("/transcribe", authenticate, InterviewController.transcribeAudio);
router.post("/answer", authenticate, InterviewController.submitAnswer);
router.post("/end", authenticate, InterviewController.endInterview);
router.get("/session/:sessionId", authenticate, InterviewController.getSession);
router.get("/report/:sessionId", authenticate, InterviewController.getReport);

// --- MOCK INTERVIEW DATABASE HISTORY PIPELINE ---
router.get("/history", authenticate, InterviewController.getUserHistory);
router.get("/history/:id", authenticate, InterviewController.getHistoryById);
router.delete("/history/:id", authenticate, InterviewController.deleteHistoryById);
router.post("/history", authenticate, InterviewController.saveHistoryRecord);

// --- CONVERSATIONAL ENGLISH & FLUENCY COACH ENDPOINT ---
router.post("/english-fluency", authenticate, async (req: Request, res: Response) => {
  try {
    const { currentQuestion, transcript, isFinalQuestion } = req.body;
    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({ error: "Transcript is required for English fluency analysis." });
    }

    const evaluation = await AIInterviewService.evaluateEnglishFluency({
      currentQuestion: currentQuestion || "Could you introduce yourself and walk me through your background?",
      candidateSpeech: transcript.trim(),
      isFinalQuestion: Boolean(isFinalQuestion)
    });

    res.json({
      success: true,
      evaluation,
      nextQuestion: evaluation.nextQuestion
    });
  } catch (error: any) {
    console.error("English fluency evaluation error:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate English speaking performance" });
  }
});

// --- LEGACY ENDPOINTS (BACKWARD COMPATIBILITY) ---
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

router.post("/questions", authenticate, async (req: Request, res: Response) => {
  try {
    const { targetRole, company, difficulty, category } = req.body;
    const ai = getGeminiClient();
    const prompt = `Generate 4 realistic software engineering interview questions for a candidate interviewing at ${company || 'a Tech Company'} for a ${targetRole || 'Software Engineer'} position. Difficulty level: ${difficulty || 'Medium'}. Focus category: ${category || 'Technical & System Design'}.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              question: { type: Type.STRING },
              hints: { type: Type.ARRAY, items: { type: Type.STRING } },
              expectedKeyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["question", "type", "expectedKeyPoints"]
          }
        }
      }
    });

    const questions = JSON.parse(response.text || "[]");
    res.json({ success: true, questions });
  } catch (error: any) {
    console.error("Legacy questions error:", error);
    res.status(500).json({ error: error.message || "Failed to generate questions" });
  }
});

router.post("/evaluate", authenticate, async (req: Request, res: Response) => {
  try {
    const { question, userAnswer, targetRole } = req.body;
    if (!question || !userAnswer) {
      return res.status(400).json({ error: "Question and userAnswer are required" });
    }

    const ai = getGeminiClient();
    const prompt = `Evaluate the candidate's answer: Question: "${question}" Answer: "${userAnswer}" for ${targetRole || 'Software Engineer'}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            missedPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            idealAnswerSnippet: { type: Type.STRING }
          },
          required: ["score", "feedback", "strengths", "missedPoints"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, ...data });
  } catch (error: any) {
    console.error("Legacy evaluate error:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate" });
  }
});

export default router;
