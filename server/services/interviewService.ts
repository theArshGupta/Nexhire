import { MockInterviewModel } from "../models/MockInterview.js";
import { AIInterviewService } from "./aiInterviewService.js";

// In-memory cache when MongoDB is offline
const inMemoryInterviews = new Map<string, any>();

export class InterviewService {
  /** Start a new mock interview session */
  static async startSession(params: {
    userId: string;
    role: string;
    company?: string;
    experienceLevel?: string;
    interviewType?: string;
    jobDescription?: string;
    resumeId?: string;
    totalQuestions?: number;
  }) {
    const role = params.role || "Software Engineer";
    const company = params.company || "Tech Company";
    const experienceLevel = params.experienceLevel || "Mid-level";
    const interviewType = params.interviewType || "Technical & System Design";
    const totalQuestions = params.totalQuestions || 5;

    // 1. Generate First Question using AI
    const firstQuestion = await AIInterviewService.generateFirstQuestion({
      role,
      company,
      experienceLevel,
      interviewType,
      jobDescription: params.jobDescription,
      resumeContext: params.resumeId ? `Resume Ref ID: ${params.resumeId}` : undefined
    });

    const sessionId = `int_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const firstMessage = {
      id: `msg_1_${Date.now()}`,
      sender: "AI" as const,
      question: firstQuestion,
      timestamp: nowIso
    };

    const interviewDoc = {
      _id: sessionId,
      userId: params.userId,
      role,
      company,
      experienceLevel,
      interviewType,
      difficulty: "Medium",
      status: "started" as const,
      currentQuestionNumber: 1,
      totalQuestions,
      currentQuestion: firstQuestion,
      jobDescription: params.jobDescription,
      resumeReference: params.resumeId,
      messages: [firstMessage],
      startedAt: nowIso,
      createdAt: nowIso
    };

    inMemoryInterviews.set(sessionId, interviewDoc);

    try {
      const doc = new MockInterviewModel(interviewDoc);
      await doc.save();
    } catch (dbErr) {
      console.warn("MongoDB unavailable, saving mock interview in memory.");
    }

    return {
      sessionId,
      role,
      company,
      experienceLevel,
      interviewType,
      firstQuestion,
      currentQuestionNumber: 1,
      totalQuestions,
      status: interviewDoc.status
    };
  }

  /** Transcribe audio using Groq Whisper */
  static async transcribeAudio(audioBuffer: Buffer, filename?: string) {
    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error("Audio buffer is empty.");
    }
    return await AIInterviewService.transcribeAudio(audioBuffer, filename);
  }

  /** Submit candidate answer, evaluate response, and generate follow-up question */
  static async submitAnswer(params: {
    sessionId: string;
    userId: string;
    answerText: string;
    duration?: number;
  }) {
    let interview = inMemoryInterviews.get(params.sessionId);
    if (!interview) {
      try {
        interview = await (MockInterviewModel as any).findById(params.sessionId);
      } catch (_) {}
    }

    if (!interview) {
      throw new Error("Interview record not found.");
    }

    if (interview.userId !== params.userId) {
      throw new Error("Unauthorized access to interview.");
    }

    if (interview.status === "completed") {
      throw new Error("This interview has already been completed.");
    }

    const previousTurns = (interview.messages || [])
      .filter((m: any) => m.answer && m.answer.trim().length > 0)
      .map((m: any) => ({
        question: m.question,
        answer: m.answer,
        evaluation: m.evaluation
      }));

    const currentQuestion = interview.currentQuestion || "Could you walk me through your technical background?";
    const isFinalQuestion = interview.currentQuestionNumber >= interview.totalQuestions;

    // AI Evaluation & Follow-up Generation
    const evaluation = await AIInterviewService.evaluateAnswerAndGenerateNext({
      role: interview.role,
      company: interview.company,
      experienceLevel: interview.experienceLevel,
      currentQuestion,
      candidateAnswer: params.answerText,
      previousConversation: previousTurns,
      isFinalQuestion
    });

    const nowIso = new Date().toISOString();

    const userMessageTurn = {
      id: `msg_usr_${Date.now()}`,
      sender: "User" as const,
      question: currentQuestion,
      answer: params.answerText,
      transcript: params.answerText,
      duration: params.duration || 0,
      evaluation,
      timestamp: nowIso
    };

    interview.messages = interview.messages || [];
    interview.messages.push(userMessageTurn);

    let nextQuestion = evaluation.nextQuestion || "";
    let isCompleted = false;

    if (isFinalQuestion || !nextQuestion) {
      interview.status = "completed";
      interview.completedAt = nowIso;
      interview.currentQuestion = "";
      isCompleted = true;
    } else {
      interview.status = "in_progress";
      interview.currentQuestionNumber += 1;
      interview.currentQuestion = nextQuestion;

      const nextAiTurn = {
        id: `msg_ai_${Date.now()}`,
        sender: "AI" as const,
        question: nextQuestion,
        timestamp: nowIso
      };
      interview.messages.push(nextAiTurn);
    }

    inMemoryInterviews.set(params.sessionId, interview);

    try {
      await (MockInterviewModel as any).findByIdAndUpdate(params.sessionId, {
        status: interview.status,
        completedAt: interview.completedAt,
        currentQuestionNumber: interview.currentQuestionNumber,
        currentQuestion: interview.currentQuestion,
        messages: interview.messages
      });
    } catch (_) {}

    return {
      evaluation,
      nextQuestion,
      currentQuestionNumber: interview.currentQuestionNumber,
      totalQuestions: interview.totalQuestions,
      isCompleted,
      status: interview.status
    };
  }

  /** End interview session & generate single comprehensive report inside the document */
  static async endSession(sessionId: string, userId: string) {
    let interview = inMemoryInterviews.get(sessionId);
    if (!interview) {
      try {
        interview = await (MockInterviewModel as any).findById(sessionId);
      } catch (_) {}
    }

    if (!interview) {
      throw new Error("Interview record not found.");
    }

    if (interview.userId !== userId) {
      throw new Error("Unauthorized access to interview.");
    }

    if (interview.report) {
      return interview.report;
    }

    const conversationTurns = (interview.messages || [])
      .filter((m: any) => m.answer && m.answer.trim().length > 0)
      .map((m: any) => ({
        question: m.question,
        answer: m.answer,
        evaluation: m.evaluation
      }));

    // Generate Final Report via AI
    const reportData = await AIInterviewService.generateFinalReport({
      role: interview.role,
      company: interview.company,
      experienceLevel: interview.experienceLevel,
      conversationHistory: conversationTurns
    });

    const nowIso = new Date().toISOString();

    const reportObj = {
      overallScore: reportData.overallScore,
      technicalScore: reportData.technicalScore,
      communicationScore: reportData.communicationScore,
      confidenceScore: reportData.confidenceScore,
      problemSolvingScore: reportData.problemSolvingScore,
      behavioralScore: reportData.behavioralScore,
      strengths: reportData.strengths,
      weaknesses: reportData.weaknesses,
      recruiterFeedback: reportData.recruiterFeedback,
      hiringRecommendation: reportData.hiringRecommendation,
      improvementPlan: reportData.improvementPlan,
      suggestedTopics: reportData.suggestedTopics,
      idealAnswers: reportData.idealAnswers
    };

    interview.report = reportObj;
    interview.status = "completed";
    interview.completedAt = interview.completedAt || nowIso;

    inMemoryInterviews.set(sessionId, interview);

    try {
      await (MockInterviewModel as any).findByIdAndUpdate(sessionId, {
        report: reportObj,
        status: "completed",
        completedAt: interview.completedAt
      });
    } catch (_) {}

    return reportObj;
  }

  /** Get Session details and full conversation messages from unified model */
  static async getSessionDetails(sessionId: string, userId: string) {
    let interview = inMemoryInterviews.get(sessionId);
    if (!interview) {
      try {
        interview = await (MockInterviewModel as any).findById(sessionId);
      } catch (_) {}
    }

    if (!interview) {
      throw new Error("Interview record not found.");
    }

    if (interview.userId !== userId) {
      throw new Error("Unauthorized access to interview.");
    }

    return {
      session: interview,
      messages: interview.messages || []
    };
  }

  /** Get Final Report from unified model */
  static async getReport(sessionId: string, userId: string) {
    let interview = inMemoryInterviews.get(sessionId);
    if (!interview) {
      try {
        interview = await (MockInterviewModel as any).findById(sessionId);
      } catch (_) {}
    }

    if (!interview) {
      throw new Error("Interview record not found.");
    }

    if (interview.userId !== userId) {
      throw new Error("Unauthorized access to interview.");
    }

    if (!interview.report) {
      return await this.endSession(sessionId, userId);
    }

    return interview.report;
  }

  /** Save a complete Mock Interview document */
  static async saveMockInterviewRecord(record: any) {
    const userId = record.userId || "demo-user";
    const sessionId = record._id || record.id || `int_${Date.now()}`;
    const fullDoc = {
      _id: sessionId,
      userId,
      role: record.role || "Software Engineer",
      company: record.company || "Tech Company",
      experienceLevel: record.experienceLevel || "Mid-level",
      interviewType: record.interviewType || "Technical",
      difficulty: record.difficulty || "Medium",
      status: record.status || "completed",
      currentQuestionNumber: record.questions?.length || 5,
      totalQuestions: record.questions?.length || 5,
      messages: record.questions?.map((q: any, idx: number) => ({
        id: q.id || `msg_${idx}`,
        sender: "User",
        question: q.question,
        answer: q.userAnswer,
        evaluation: {
          technicalScore: q.score || 80,
          communicationScore: 80,
          confidenceScore: 80,
          clarityScore: 80,
          depthScore: 80,
          structureScore: 80,
          examplesScore: 80,
          problemSolvingScore: 80,
          strengths: record.feedback?.strengths || [],
          weaknesses: record.feedback?.weaknesses || [],
          betterAnswer: q.suggestedAnswer || "",
          feedback: q.feedbackStatement || ""
        },
        timestamp: new Date().toISOString()
      })) || [],
      report: {
        overallScore: record.overallScore || 80,
        technicalScore: record.technicalScore || 80,
        communicationScore: record.communicationScore || 80,
        confidenceScore: record.confidenceScore || 80,
        problemSolvingScore: 80,
        behavioralScore: 80,
        grammarScore: record.grammarScore || 80,
        vocabularyScore: record.vocabularyScore || 80,
        strengths: record.feedback?.strengths || [],
        weaknesses: record.feedback?.weaknesses || [],
        recruiterFeedback: record.feedback?.impressive || "Strong candidate performance.",
        hiringRecommendation: record.feedback?.hiringRecommendation || "Hire",
        improvementPlan: record.feedback?.improvementPlan || [],
        fillerWords: record.feedback?.fillerWords || []
      },
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    inMemoryInterviews.set(sessionId, fullDoc);

    try {
      const doc = new MockInterviewModel(fullDoc);
      await doc.save();
    } catch (err) {
      console.warn("MongoDB MockInterviewModel save error:", err);
    }
    return fullDoc;
  }

  /** Get all interview history records for a user */
  static async getUserHistory(userId: string) {
    let history: any[] = [];
    try {
      history = await (MockInterviewModel as any).find({ userId }).sort({ createdAt: -1 });
    } catch (_) {}

    if (!history || history.length === 0) {
      history = Array.from(inMemoryInterviews.values()).filter((item) => item.userId === userId);
    }

    return history;
  }

  /** Get single interview record by ID */
  static async getHistoryById(id: string, userId: string) {
    let record: any = null;
    try {
      record = await (MockInterviewModel as any).findById(id);
    } catch (_) {}

    if (!record) {
      record = inMemoryInterviews.get(id);
    }

    return record;
  }

  /** Delete interview record by ID */
  static async deleteHistoryById(id: string, userId: string) {
    try {
      await (MockInterviewModel as any).deleteOne({ _id: id, userId });
    } catch (_) {}

    inMemoryInterviews.delete(id);
    return { success: true };
  }
}
