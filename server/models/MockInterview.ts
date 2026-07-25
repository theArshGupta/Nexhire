import mongoose, { Schema, Document } from "mongoose";

export interface IMockInterviewMessage {
  id: string;
  sender: "AI" | "User";
  question: string;
  answer?: string;
  transcript?: string;
  duration?: number;
  evaluation?: {
    technicalScore: number;
    communicationScore: number;
    confidenceScore: number;
    clarityScore: number;
    depthScore: number;
    structureScore: number;
    examplesScore: number;
    problemSolvingScore: number;
    strengths: string[];
    weaknesses: string[];
    betterAnswer: string;
    feedback: string;
    nextQuestion?: string;
  };
  timestamp: string;
}

export interface IMockInterviewReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  behavioralScore: number;
  grammarScore?: number;
  vocabularyScore?: number;
  fluencyScore?: number;
  strengths: string[];
  weaknesses: string[];
  recruiterFeedback: string;
  hiringRecommendation: "Strong Hire" | "Hire" | "Weak Hire" | "No Hire";
  improvementPlan: string[];
  suggestedTopics: string[];
  fillerWords?: string[];
  idealAnswers?: Array<{
    question: string;
    userAnswer: string;
    idealAnswer: string;
    keyTakeaway: string;
  }>;
}

export interface IMockInterview extends Document {
  userId: string;
  role: string;
  company: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  status: "started" | "in_progress" | "completed";
  currentQuestionNumber: number;
  totalQuestions: number;
  currentQuestion?: string;
  jobDescription?: string;
  resumeReference?: string;
  messages: IMockInterviewMessage[];
  report?: IMockInterviewReport;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

const EvaluationSchema = new Schema(
  {
    technicalScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    clarityScore: { type: Number, default: 0 },
    depthScore: { type: Number, default: 0 },
    structureScore: { type: Number, default: 0 },
    examplesScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    betterAnswer: { type: String, default: "" },
    feedback: { type: String, default: "" },
    nextQuestion: { type: String, default: "" }
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    id: { type: String, required: true },
    sender: { type: String, enum: ["AI", "User"], required: true },
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    transcript: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    evaluation: { type: EvaluationSchema, required: false },
    timestamp: { type: String, required: true, default: () => new Date().toISOString() }
  },
  { _id: false }
);

const IdealAnswerSchema = new Schema(
  {
    question: { type: String, required: true },
    userAnswer: { type: String, required: true },
    idealAnswer: { type: String, required: true },
    keyTakeaway: { type: String, required: true }
  },
  { _id: false }
);

const ReportSchema = new Schema(
  {
    overallScore: { type: Number, required: true, default: 0 },
    technicalScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    behavioralScore: { type: Number, default: 0 },
    grammarScore: { type: Number, default: 0 },
    vocabularyScore: { type: Number, default: 0 },
    fluencyScore: { type: Number, default: 0 },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recruiterFeedback: { type: String, default: "" },
    hiringRecommendation: {
      type: String,
      enum: ["Strong Hire", "Hire", "Weak Hire", "No Hire"],
      default: "Hire"
    },
    improvementPlan: [{ type: String }],
    suggestedTopics: [{ type: String }],
    fillerWords: [{ type: String }],
    idealAnswers: [IdealAnswerSchema]
  },
  { _id: false }
);

const MockInterviewSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    role: { type: String, required: true },
    company: { type: String, required: true, default: "Tech Company" },
    experienceLevel: { type: String, required: true, default: "Mid-level" },
    interviewType: { type: String, required: true, default: "Technical" },
    difficulty: { type: String, default: "Medium" },
    status: { type: String, enum: ["started", "in_progress", "completed"], default: "started" },
    currentQuestionNumber: { type: Number, default: 1 },
    totalQuestions: { type: Number, default: 5 },
    currentQuestion: { type: String, default: "" },
    jobDescription: { type: String, required: false },
    resumeReference: { type: String, required: false },
    messages: [MessageSchema],
    report: { type: ReportSchema, required: false },
    startedAt: { type: String, required: true, default: () => new Date().toISOString() },
    completedAt: { type: String, required: false },
    createdAt: { type: String, required: true, default: () => new Date().toISOString() }
  },
  {
    timestamps: true
  }
);

export const MockInterviewModel =
  mongoose.models.UnifiedMockInterview ||
  mongoose.model<IMockInterview>("UnifiedMockInterview", MockInterviewSchema);
