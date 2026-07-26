import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { InterviewService } from "../services/interviewService";

export class InterviewController {
  /** POST /api/interview/start */
  static async startInterview(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { role, company, experienceLevel, interviewType, jobDescription, resumeId, totalQuestions } = req.body;

      if (!role) {
        return res.status(400).json({ error: "Target role is required to start an interview." });
      }

      const result = await InterviewService.startSession({
        userId,
        role,
        company,
        experienceLevel,
        interviewType,
        jobDescription,
        resumeId,
        totalQuestions: totalQuestions ? Number(totalQuestions) : 5
      });

      res.status(201).json({
        success: true,
        message: "Interview session started successfully",
        data: result,
        sessionId: result.sessionId,
        firstQuestion: result.firstQuestion
      });
    } catch (error: any) {
      console.error("Start interview error:", error);
      res.status(500).json({ error: error.message || "Failed to start interview session" });
    }
  }

  /** POST /api/interview/transcribe */
  static async transcribeAudio(req: Request, res: Response) {
    try {
      let audioBuffer: Buffer | null = null;
      let filename = "recording.wav";

      const anyReq = req as any;
      if (anyReq.file) {
        audioBuffer = anyReq.file.buffer;
        filename = anyReq.file.originalname || filename;
      } else if (req.body?.audioBase64) {
        const cleanBase64 = req.body.audioBase64.includes(",")
          ? req.body.audioBase64.split(",")[1]
          : req.body.audioBase64;
        audioBuffer = Buffer.from(cleanBase64, "base64");
      } else if (Buffer.isBuffer(req.body)) {
        audioBuffer = req.body;
      }

      if (!audioBuffer || audioBuffer.length === 0) {
        return res.status(400).json({ error: "No audio data provided for transcription." });
      }

      const transcript = await InterviewService.transcribeAudio(audioBuffer, filename);

      res.json({
        success: true,
        transcript
      });
    } catch (error: any) {
      console.error("Transcribe audio error:", error);
      res.status(500).json({ error: error.message || "Speech-to-Text transcription failed" });
    }
  }

  /** POST /api/interview/answer */
  static async submitAnswer(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { sessionId, transcript, answer, duration } = req.body;

      const candidateAnswer = transcript || answer;

      if (!sessionId) {
        return res.status(400).json({ error: "sessionId is required." });
      }

      if (!candidateAnswer || candidateAnswer.trim().length === 0) {
        return res.status(400).json({ error: "Answer or transcript text is required." });
      }

      const result = await InterviewService.submitAnswer({
        sessionId,
        userId,
        answerText: candidateAnswer.trim(),
        duration: duration ? Number(duration) : 0
      });

      res.json({
        success: true,
        data: result,
        evaluation: result.evaluation,
        nextQuestion: result.nextQuestion,
        scores: {
          technicalScore: result.evaluation.technicalScore,
          communicationScore: result.evaluation.communicationScore,
          confidenceScore: result.evaluation.confidenceScore,
          problemSolvingScore: result.evaluation.problemSolvingScore
        }
      });
    } catch (error: any) {
      console.error("Submit answer error:", error);
      res.status(500).json({ error: error.message || "Failed to process interview answer" });
    }
  }

  /** POST /api/interview/end */
  static async endInterview(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: "sessionId is required to end interview." });
      }

      const report = await InterviewService.endSession(sessionId, userId);

      res.json({
        success: true,
        message: "Interview session completed and report generated",
        report,
        data: report
      });
    } catch (error: any) {
      console.error("End interview error:", error);
      res.status(500).json({ error: error.message || "Failed to generate final interview report" });
    }
  }

  /** GET /api/interview/session/:sessionId */
  static async getSession(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { sessionId } = req.params;

      const data = await InterviewService.getSessionDetails(sessionId, userId);

      res.json({
        success: true,
        data
      });
    } catch (error: any) {
      console.error("Get session error:", error);
      res.status(404).json({ error: error.message || "Session not found" });
    }
  }

  /** GET /api/interview/report/:sessionId */
  static async getReport(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { sessionId } = req.params;

      const report = await InterviewService.getReport(sessionId, userId);

      res.json({
        success: true,
        data: report,
        report
      });
    } catch (error: any) {
      console.error("Get report error:", error);
      res.status(404).json({ error: error.message || "Report not found" });
    }
  }

  /** GET /api/interview/history */
  static async getUserHistory(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;

      const history = await InterviewService.getUserHistory(userId);

      res.json({
        success: true,
        history,
        data: history
      });
    } catch (error: any) {
      console.error("Get user history error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch interview history" });
    }
  }

  /** GET /api/interview/history/:id */
  static async getHistoryById(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { id } = req.params;

      const record = await InterviewService.getHistoryById(id, userId);

      res.json({
        success: true,
        record,
        data: record
      });
    } catch (error: any) {
      console.error("Get history record error:", error);
      res.status(404).json({ error: error.message || "History record not found" });
    }
  }

  /** DELETE /api/interview/history/:id */
  static async deleteHistoryById(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { id } = req.params;

      await InterviewService.deleteHistoryById(id, userId);

      res.json({
        success: true,
        message: "Interview record deleted successfully"
      });
    } catch (error: any) {
      console.error("Delete history error:", error);
      res.status(500).json({ error: error.message || "Failed to delete interview record" });
    }
  }

  /** POST /api/interview/history */
  static async saveHistoryRecord(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;

      const saved = await InterviewService.saveMockInterviewRecord({
        userId,
        ...req.body
      });

      res.status(201).json({
        success: true,
        message: "Interview record saved to database",
        data: saved
      });
    } catch (error: any) {
      console.error("Save history error:", error);
      res.status(500).json({ error: error.message || "Failed to save interview record" });
    }
  }
}
