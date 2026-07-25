import mongoose, { Schema, model, Model } from "mongoose";
import crypto from "node:crypto";

export interface User {
  id: string;
  name: string;
  email: string;
  college?: string;
  graduationYear?: string;
  targetRole?: string;
  avatar?: string;
  resumeScore?: number;
  dsaSolvedCount?: number;
  interviewsCompleted?: number;
  streakDays?: number;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  role: string;
  status: 'Matched' | 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Rejected';
  matchScore: number;
  appliedDate: string;
  logo: string;
}

export interface DSAProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  companyTags: string[];
  description: string;
  starterCode: string;
  testCases: { input: string; expectedOutput: string }[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  company: string;
  difficulty: string;
  score: number;
  createdAt: string;
  questionsCount: number;
  status: 'Completed' | 'In Progress';
  feedbackSummary: string;
}

// Helper to hash passwords securely using scrypt
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

// --- Mongoose Schemas ---

const UserSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  college: String,
  graduationYear: String,
  targetRole: String,
  avatar: String,
  resumeScore: { type: Number, default: 0 },
  dsaSolvedCount: { type: Number, default: 0 },
  interviewsCompleted: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  passwordHash: String,
  passwordSalt: String,
  createdAt: { type: String, required: true }
});

const SessionSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: String, required: true }
});

const OtpSchema = new Schema({
  _id: { type: String, required: true }, // email
  otp: { type: String, required: true },
  createdAt: { type: String, required: true }
});

const JobApplicationSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, required: true },
  matchScore: { type: Number, required: true },
  appliedDate: { type: String, required: true },
  logo: { type: String, required: true }
});

const DSAProblemSchema = new Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  difficulty: { type: String, required: true },
  category: { type: String, required: true },
  companyTags: { type: [String], default: [] },
  description: { type: String, required: true },
  starterCode: { type: String, required: true },
  testCases: [{ input: String, expectedOutput: String }]
});

import { MockInterviewModel } from "./models/MockInterview.js";

const ResumeAnalysisSchema = new Schema({
  _id: { type: String, required: true }, // userId
  atsScore: { type: Number, required: true },
  summary: { type: String, required: true },
  strengths: { type: [String], default: [] },
  criticalGaps: { type: [String], default: [] },
  keywordSuggestions: { type: [String], default: [] },
  actionableFixes: [{
    key: String,
    label: String,
    impact: String,
    rec: String,
    tip: String
  }],
  breakdown: {
    formattingScore: { type: Number, default: 0 },
    impactQuantifyingScore: { type: Number, default: 0 },
    skillsMatchScore: { type: Number, default: 0 },
    keywordDensityScore: { type: Number, default: 0 }
  },
  analyzedAt: { type: String, required: true }
});

const UserModel = (mongoose.models.User || model("User", UserSchema)) as Model<any>;
const SessionModel = (mongoose.models.Session || model("Session", SessionSchema)) as Model<any>;
const OtpModel = (mongoose.models.Otp || model("Otp", OtpSchema)) as Model<any>;
const JobApplicationModel = (mongoose.models.JobApplication || model("JobApplication", JobApplicationSchema)) as Model<any>;
const DSAProblemModel = (mongoose.models.DSAProblem || model("DSAProblem", DSAProblemSchema)) as Model<any>;
const ResumeAnalysisModel = (mongoose.models.ResumeAnalysis || model("ResumeAnalysis", ResumeAnalysisSchema)) as Model<any>;

// Helper mapper functions
function mapUser(doc: any): User {
  return {
    id: doc._id,
    name: doc.name,
    email: doc.email,
    college: doc.college || undefined,
    graduationYear: doc.graduationYear || undefined,
    targetRole: doc.targetRole || undefined,
    avatar: doc.avatar || undefined,
    resumeScore: doc.resumeScore,
    dsaSolvedCount: doc.dsaSolvedCount,
    interviewsCompleted: doc.interviewsCompleted,
    streakDays: doc.streakDays,
    createdAt: doc.createdAt
  };
}

export class Database {
  private connected: Promise<typeof mongoose>;
  private connectionError: Error | null = null;

  constructor() {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nexhire";
    this.connected = mongoose.connect(uri)
      .then(m => {
        console.log("Connected to MongoDB successfully");
        this.seedDataIfNeeded().catch(err => {
          console.error("Failed to seed data:", err);
        });
        return m;
      })
      .catch(err => {
        console.error("Failed to connect to MongoDB. Please ensure your MongoDB instance is running or MONGODB_URI in .env.local is configured correctly. Details:", err);
        this.connectionError = err;
        return mongoose; // Return resolved promise to avoid uncaught exception crash
      });
  }

  private async ensureConnected() {
    if (this.connectionError) {
      throw new Error(`Database connection failed: ${this.connectionError.message}`);
    }
    await this.connected;
  }

  private async seedDataIfNeeded() {
    // 1. Seed demo user
    const checkUser = await UserModel.findById("usr_demo123");
    if (!checkUser) {
      const salt = generateSalt();
      const passHash = hashPassword("demo123", salt);
      const demoUser = new UserModel({
        _id: "usr_demo123",
        name: "Alex Rivera",
        email: "alex@nexhire.ai",
        college: "Stanford University",
        graduationYear: "2026",
        targetRole: "Software Engineer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        resumeScore: 88,
        dsaSolvedCount: 142,
        interviewsCompleted: 8,
        streakDays: 14,
        passwordHash: passHash,
        passwordSalt: salt,
        createdAt: new Date().toISOString()
      });
      await demoUser.save();
    }

    // 2. Seed DSA problems
    const dsaCount = await DSAProblemModel.countDocuments();
    if (dsaCount === 0) {
      await DSAProblemModel.create([
        {
          _id: "dsa_1",
          title: "Two Sum",
          difficulty: "Easy",
          category: "Arrays & Hashing",
          companyTags: ["Google", "Amazon", "Meta"],
          description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
          starterCode: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
          testCases: [
            { input: "[2,7,11,15], 9", expectedOutput: "[0, 1]" },
            { input: "[3,2,4], 6", expectedOutput: "[1, 2]" }
          ]
        },
        {
          _id: "dsa_2",
          title: "Longest Substring Without Repeating Characters",
          difficulty: "Medium",
          category: "Sliding Window",
          companyTags: ["Meta", "Microsoft", "Uber"],
          description: "Given a string `s`, find the length of the longest substring without repeating characters.",
          starterCode: `function lengthOfLongestSubstring(s: string): number {\n  let maxLen = 0, left = 0;\n  const set = new Set<string>();\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left++]);\n    }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
          testCases: [
            { input: '"abcabcbb"', expectedOutput: "3" },
            { input: '"bbbbb"', expectedOutput: "1" }
          ]
        },
        {
          _id: "dsa_3",
          title: "Merge K Sorted Lists",
          difficulty: "Hard",
          category: "Heaps / Priority Queue",
          companyTags: ["Google", "Apple"],
          description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
          starterCode: `function mergeKLists(lists: any[]): any {\n  // Implement min-heap approach or divide & conquer\n  return null;\n}`,
          testCases: [
            { input: "[[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]" }
          ]
        }
      ]);
    }

    // 3. Seed initial Job Applications for demo user
    const appCount = await JobApplicationModel.countDocuments();
    if (appCount === 0) {
      await JobApplicationModel.create([
        { _id: "app_1", userId: "usr_demo123", companyName: "Google", role: "Software Engineer, University Grad", status: "Interview", matchScore: 94, appliedDate: "2026-07-15", logo: "🔍" },
        { _id: "app_2", userId: "usr_demo123", companyName: "Meta", role: "Frontend Engineer", status: "Screening", matchScore: 89, appliedDate: "2026-07-18", logo: "♾️" },
        { _id: "app_3", userId: "usr_demo123", companyName: "Amazon", role: "SDE I", status: "Matched", matchScore: 91, appliedDate: "2026-07-20", logo: "📦" },
        { _id: "app_4", userId: "usr_demo123", companyName: "Microsoft", role: "Software Engineer", status: "Offered", matchScore: 96, appliedDate: "2026-07-02", logo: "🪟" }
      ]);
    }

    // 4. Seed initial Interview Sessions for demo user
    const intCount = await MockInterviewModel.countDocuments();
    if (intCount === 0) {
      await MockInterviewModel.create([
        { _id: "int_1", userId: "usr_demo123", role: "Software Engineer", company: "Google", difficulty: "Hard", report: { overallScore: 92, recruiterFeedback: "Excellent problem structure." }, createdAt: "2026-07-21T14:30:00Z", totalQuestions: 4, status: "completed" },
        { _id: "int_2", userId: "usr_demo123", role: "Frontend Engineer", company: "Meta", difficulty: "Medium", report: { overallScore: 85, recruiterFeedback: "Strong system design understanding." }, createdAt: "2026-07-19T10:15:00Z", totalQuestions: 3, status: "completed" }
      ]);
    }
  }

  // --- API Interfaces ---

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureConnected();
    const doc = await UserModel.findOne({ email }).lean();
    if (!doc) return undefined;
    return mapUser(doc);
  }

  async getUserById(id: string): Promise<User | undefined> {
    await this.ensureConnected();
    const doc = await UserModel.findById(id).lean();
    if (!doc) return undefined;
    return mapUser(doc);
  }

  async createUser(userData: Partial<User> & { email: string; password?: string }): Promise<User> {
    await this.ensureConnected();
    const id = `usr_${Date.now()}`;
    const salt = generateSalt();
    const passHash = hashPassword(userData.password || "defaultPassword123", salt);

    const userDoc = new UserModel({
      _id: id,
      name: userData.name || userData.email.split("@")[0],
      email: userData.email,
      college: userData.college || "University Candidate",
      graduationYear: userData.graduationYear || "2026",
      targetRole: userData.targetRole || "Software Engineer",
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      resumeScore: userData.resumeScore ?? 75,
      dsaSolvedCount: userData.dsaSolvedCount ?? 0,
      interviewsCompleted: userData.interviewsCompleted ?? 0,
      streakDays: userData.streakDays ?? 1,
      passwordHash: passHash,
      passwordSalt: salt,
      createdAt: new Date().toISOString()
    });

    await userDoc.save();
    return mapUser(userDoc);
  }

  async validatePassword(email: string, passwordAttempt: string): Promise<boolean> {
    await this.ensureConnected();
    const doc = await UserModel.findOne({ email }).select("passwordHash passwordSalt").lean() as any;
    if (!doc || !doc.passwordHash || !doc.passwordSalt) return false;
    const computedHash = hashPassword(passwordAttempt, doc.passwordSalt);
    return computedHash === doc.passwordHash;
  }

  async resetPassword(email: string, passwordAttempt: string): Promise<boolean> {
    await this.ensureConnected();
    const salt = generateSalt();
    const passHash = hashPassword(passwordAttempt, salt);
    
    const doc = await UserModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: { passwordHash: passHash, passwordSalt: salt } },
      { returnDocument: 'after' }
    );
    return !!doc;
  }

  async saveOTP(email: string, otp: string): Promise<void> {
    await this.ensureConnected();
    const cleanEmail = email.toLowerCase().trim();
    await OtpModel.findOneAndUpdate(
      { _id: cleanEmail },
      { $set: { _id: cleanEmail, otp, createdAt: new Date().toISOString() } },
      { upsert: true, returnDocument: 'after' }
    );
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    await this.ensureConnected();
    const cleanEmail = email.toLowerCase().trim();
    const doc = await OtpModel.findById(cleanEmail).lean() as any;
    if (doc && doc.otp === otp) {
      await OtpModel.findByIdAndDelete(cleanEmail);
      return true;
    }
    return false;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    await this.ensureConnected();
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: 'after' }
    ).lean();
    if (!doc) return undefined;
    return mapUser(doc);
  }

  // --- Session Operations ---

  async createSession(userId: string): Promise<string> {
    await this.ensureConnected();
    const token = `token_${crypto.randomUUID().replace(/-/g, "")}`;
    const sessionDoc = new SessionModel({
      _id: token,
      userId,
      createdAt: new Date().toISOString()
    });
    await sessionDoc.save();
    return token;
  }

  async getSessionUser(token: string): Promise<User | undefined> {
    await this.ensureConnected();
    const session = await SessionModel.findById(token).lean() as any;
    if (!session) return undefined;
    return this.getUserById(session.userId);
  }

  async deleteSession(token: string): Promise<void> {
    await this.ensureConnected();
    await SessionModel.findByIdAndDelete(token);
  }

  // --- Job Applications ---

  async getApplications(userId: string): Promise<JobApplication[]> {
    await this.ensureConnected();
    const docs = await JobApplicationModel.find({ userId }).sort({ appliedDate: -1 }).lean() as any[];
    return docs.map(doc => ({
      id: doc._id,
      userId: doc.userId,
      companyName: doc.companyName,
      role: doc.role,
      status: doc.status,
      matchScore: doc.matchScore,
      appliedDate: doc.appliedDate,
      logo: doc.logo
    }));
  }

  async addApplication(app: Omit<JobApplication, 'id'>): Promise<JobApplication> {
    await this.ensureConnected();
    const id = `app_${Date.now()}`;
    const newAppDoc = new JobApplicationModel({
      _id: id,
      ...app
    });
    await newAppDoc.save();
    return {
      id,
      ...app
    };
  }

  // --- DSA Problems ---

  async getDSAProblems(): Promise<DSAProblem[]> {
    await this.ensureConnected();
    const docs = await DSAProblemModel.find().lean() as any[];
    return docs.map(doc => ({
      id: doc._id,
      title: doc.title,
      difficulty: doc.difficulty,
      category: doc.category,
      companyTags: doc.companyTags || [],
      description: doc.description,
      starterCode: doc.starterCode,
      testCases: doc.testCases || []
    }));
  }

  async getDSAProblemById(id: string): Promise<DSAProblem | undefined> {
    await this.ensureConnected();
    const doc = await DSAProblemModel.findById(id).lean() as any;
    if (!doc) return undefined;
    return {
      id: doc._id,
      title: doc.title,
      difficulty: doc.difficulty,
      category: doc.category,
      companyTags: doc.companyTags || [],
      description: doc.description,
      starterCode: doc.starterCode,
      testCases: doc.testCases || []
    };
  }

  // --- Interview Sessions ---

  async getInterviewSessions(userId: string): Promise<InterviewSession[]> {
    await this.ensureConnected();
    const docs = await (MockInterviewModel as any).find({ userId }).sort({ createdAt: -1 }).lean() as any[];
    return docs.map(doc => ({
      id: doc._id || doc.id,
      userId: doc.userId,
      role: doc.role,
      company: doc.company,
      difficulty: doc.difficulty || "Medium",
      score: doc.report?.overallScore || doc.overallScore || doc.score || 80,
      createdAt: doc.createdAt,
      questionsCount: doc.totalQuestions || doc.messages?.length || 5,
      status: doc.status || "completed",
      feedbackSummary: doc.report?.recruiterFeedback || doc.feedbackSummary || "Interview completed"
    }));
  }

  async addInterviewSession(session: Omit<InterviewSession, 'id' | 'createdAt'>): Promise<InterviewSession> {
    await this.ensureConnected();
    const id = `int_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const newSessionDoc = new MockInterviewModel({
      _id: id,
      userId: session.userId,
      role: session.role,
      company: session.company,
      difficulty: session.difficulty || "Medium",
      report: { overallScore: session.score, recruiterFeedback: session.feedbackSummary },
      totalQuestions: session.questionsCount || 5,
      status: session.status || "completed",
      createdAt
    });
    await newSessionDoc.save();
    return {
      id,
      createdAt,
      ...session
    };
  }

  // --- Resume Analysis Operations ---

  async saveResumeAnalysis(userId: string, data: any): Promise<any> {
    await this.ensureConnected();
    const doc = await ResumeAnalysisModel.findByIdAndUpdate(
      userId,
      {
        atsScore: data.atsScore,
        summary: data.summary,
        strengths: data.strengths || [],
        criticalGaps: data.criticalGaps || [],
        keywordSuggestions: data.keywordSuggestions || [],
        actionableFixes: data.actionableFixes || [],
        breakdown: data.breakdown || {
          formattingScore: 0,
          impactQuantifyingScore: 0,
          skillsMatchScore: 0,
          keywordDensityScore: 0
        },
        analyzedAt: new Date().toISOString()
      },
      { upsert: true, returnDocument: 'after' }
    ).lean() as any;

    return doc;
  }

  async getResumeAnalysis(userId: string): Promise<any | null> {
    await this.ensureConnected();
    const doc = await ResumeAnalysisModel.findById(userId).lean() as any;
    if (!doc) return null;
    return {
      userId: doc._id,
      atsScore: doc.atsScore,
      summary: doc.summary,
      strengths: doc.strengths || [],
      criticalGaps: doc.criticalGaps || [],
      keywordSuggestions: doc.keywordSuggestions || [],
      actionableFixes: doc.actionableFixes || [],
      breakdown: doc.breakdown || {
        formattingScore: 0,
        impactQuantifyingScore: 0,
        skillsMatchScore: 0,
        keywordDensityScore: 0
      },
      analyzedAt: doc.analyzedAt
    };
  }
}

export const db = new Database();
