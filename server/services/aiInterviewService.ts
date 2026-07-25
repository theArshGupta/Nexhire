import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import os from "os";

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is missing. Please configure it in .env.local.");
  }
  return new Groq({ apiKey });
}

/** Retry helper with exponential backoff */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      if (attempt >= retries) throw err;
      console.warn(`Groq API call failed (attempt ${attempt}/${retries}). Retrying in ${delayMs}ms...`, err?.message || err);
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw new Error("API call failed after max retries.");
}

export class AIInterviewService {
  /** Transcribe audio buffer using Groq Whisper model (whisper-large-v3) */
  static async transcribeAudio(audioBuffer: Buffer, originalFilename = "recording.wav"): Promise<string> {
    const groq = getGroqClient();
    const tempDir = os.tmpdir();
    const tempPath = path.join(tempDir, `audio_${Date.now()}_${originalFilename}`);

    try {
      fs.writeFileSync(tempPath, audioBuffer);
      const fileStream = fs.createReadStream(tempPath);

      const transcription = await withRetry(() =>
        groq.audio.transcriptions.create({
          file: fileStream,
          model: "whisper-large-v3",
          response_format: "json",
          language: "en"
        })
      );

      return transcription.text?.trim() || "";
    } catch (error: any) {
      console.error("Whisper transcription error:", error);
      throw new Error(`Speech-to-Text transcription failed: ${error.message}`);
    } finally {
      if (fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
        } catch (_) {}
      }
    }
  }

  /** Generate the initial interview question */
  static async generateFirstQuestion(params: {
    role: string;
    company: string;
    experienceLevel: string;
    interviewType: string;
    jobDescription?: string;
    resumeContext?: string;
  }): Promise<string> {
    const groq = getGroqClient();

    const systemPrompt = `You are a world-class senior technical interviewer conducting a high-stakes engineering interview for ${params.company || 'a top tech company'}.
Role: ${params.role}
Level: ${params.experienceLevel}
Focus: ${params.interviewType}
${params.jobDescription ? `Job Description Summary: "${params.jobDescription.substring(0, 1500)}"` : ""}
${params.resumeContext ? `Candidate Resume Context: "${params.resumeContext.substring(0, 1500)}"` : ""}

Rules:
- Be professional, conversational, and direct.
- Ask ONE opening interview question that sets a strong, realistic baseline for the candidate.
- Never reveal internal scoring rules. Stay strictly in character as a senior lead interviewer.
- Return ONLY the question string directly.`;

    return await withRetry(async () => {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Please begin the interview by welcoming the candidate and asking the opening ${params.interviewType} question for the ${params.role} position.`
          }
        ],
        temperature: 0.4,
        max_tokens: 300
      });

      return (
        completion.choices[0]?.message?.content?.trim() ||
        `Welcome! Let's get started. Could you walk me through a complex ${params.role} project you designed recently, highlighting your technical decisions and trade-offs?`
      );
    });
  }

  /** Evaluate candidate answer across 8 metrics and generate dynamic follow-up */
  static async evaluateAnswerAndGenerateNext(params: {
    role: string;
    company: string;
    experienceLevel: string;
    currentQuestion: string;
    candidateAnswer: string;
    previousConversation: Array<{ question: string; answer: string; evaluation?: any }>;
    isFinalQuestion: boolean;
  }) {
    const groq = getGroqClient();

    const conversationHistoryText = params.previousConversation
      .map(
        (turn, i) =>
          `Turn ${i + 1}:\nInterviewer: "${turn.question}"\nCandidate: "${turn.answer}"`
      )
      .join("\n\n");

    const systemPrompt = `You are a senior hiring manager and tech interviewer at ${params.company || 'a top tier tech company'}.
You are evaluating a candidate for the role of ${params.role} (${params.experienceLevel}).

Instructions:
1. Evaluate candidate's latest answer strictly based on:
   - Technical Accuracy (0-10)
   - Communication (0-10)
   - Confidence (0-10)
   - Clarity (0-10)
   - Depth (0-10)
   - Structure (0-10)
   - Examples Used (0-10)
   - Problem Solving (0-10)
2. Identify 2-3 specific strengths in the answer.
3. Identify 2-3 specific missed edge cases or weaknesses.
4. Provide a refined "betterAnswer" example snippet illustrating how a principal engineer would answer.
5. Provide constructive "feedback" (1-2 sentences).
6. ${
      params.isFinalQuestion
        ? 'Since this is the final question, set "nextQuestion" to "".'
        : 'Generate the "nextQuestion" (follow-up). Adapt difficulty dynamically: if the candidate answer was weak, ask deeper clarifying questions; if excellent, increase technical complexity or introduce scalability edge cases.'
    }

Return ONLY valid JSON matching this exact schema:
{
  "technicalScore": <number 0-10>,
  "communicationScore": <number 0-10>,
  "confidenceScore": <number 0-10>,
  "clarityScore": <number 0-10>,
  "depthScore": <number 0-10>,
  "structureScore": <number 0-10>,
  "examplesScore": <number 0-10>,
  "problemSolvingScore": <number 0-10>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "betterAnswer": "<refined principal engineer answer snippet>",
  "feedback": "<short constructive feedback>",
  "nextQuestion": "${params.isFinalQuestion ? "" : "<dynamic adaptive follow-up question>"}"
}`;

    const userPrompt = `Interview Context & Conversation History:
${conversationHistoryText ? conversationHistoryText + "\n\n" : ""}Current Question: "${params.currentQuestion}"
Candidate Answer: "${params.candidateAnswer}"

Evaluate this answer and return JSON:`;

    return await withRetry(async () => {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1200
      });

      const raw = completion.choices[0]?.message?.content || "{}";
      const evalData = JSON.parse(raw);

      return {
        technicalScore: typeof evalData.technicalScore === "number" ? evalData.technicalScore : 7,
        communicationScore: typeof evalData.communicationScore === "number" ? evalData.communicationScore : 8,
        confidenceScore: typeof evalData.confidenceScore === "number" ? evalData.confidenceScore : 7,
        clarityScore: typeof evalData.clarityScore === "number" ? evalData.clarityScore : 8,
        depthScore: typeof evalData.depthScore === "number" ? evalData.depthScore : 7,
        structureScore: typeof evalData.structureScore === "number" ? evalData.structureScore : 7,
        examplesScore: typeof evalData.examplesScore === "number" ? evalData.examplesScore : 6,
        problemSolvingScore: typeof evalData.problemSolvingScore === "number" ? evalData.problemSolvingScore : 7,
        strengths: evalData.strengths || ["Clear structured explanation", "Good core concepts"],
        weaknesses: evalData.weaknesses || ["Could quantify metrics further", "Missed concurrency edge case"],
        betterAnswer: evalData.betterAnswer || "A principal engineer would explicitly mention trade-offs and memory boundaries.",
        feedback: evalData.feedback || "Solid response. Adding latency metrics will elevate your answer.",
        nextQuestion: params.isFinalQuestion ? "" : evalData.nextQuestion || "How would you handle high concurrency traffic spikes for this solution?"
      };
    });
  }

  /** Generate final comprehensive interview report */
  static async generateFinalReport(params: {
    role: string;
    company: string;
    experienceLevel: string;
    conversationHistory: Array<{ question: string; answer: string; evaluation?: any }>;
  }) {
    const groq = getGroqClient();

    const fullTranscriptText = params.conversationHistory
      .map(
        (turn, i) =>
          `Q${i + 1}: ${turn.question}\nA${i + 1}: ${turn.answer}\nEvaluation: Tech ${turn.evaluation?.technicalScore || 7}/10, Comm ${turn.evaluation?.communicationScore || 8}/10`
      )
      .join("\n\n");

    const systemPrompt = `You are a VP of Engineering reviewing a candidate's complete technical interview loop for the role of ${params.role} at ${params.company || 'Tech Company'}.

Analyze the complete interview transcript below and return a comprehensive hiring decision and 30-day candidate improvement plan as valid JSON.

JSON Schema:
{
  "technicalScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "problemSolvingScore": <number 0-100>,
  "behavioralScore": <number 0-100>,
  "overallScore": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "recruiterFeedback": "<detailed senior recruiter verdict>",
  "hiringRecommendation": "Strong Hire" | "Hire" | "Weak Hire" | "No Hire",
  "improvementPlan": ["<Week 1 action item>", "<Week 2 action item>", "<Week 3 action item>", "<Week 4 action item>"],
  "suggestedTopics": ["<topic 1>", "<topic 2>", "<topic 3>", "<topic 4>"],
  "idealAnswers": [
    {
      "question": "<question text>",
      "userAnswer": "<candidate answer summary>",
      "idealAnswer": "<exemplary principal engineer response>",
      "keyTakeaway": "<key lesson>"
    }
  ]
}`;

    const userPrompt = `Complete Interview Transcript:\n${fullTranscriptText}\n\nGenerate final report JSON:`;

    return await withRetry(async () => {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const raw = completion.choices[0]?.message?.content || "{}";
      const reportData = JSON.parse(raw);

      return {
        technicalScore: typeof reportData.technicalScore === "number" ? reportData.technicalScore : 78,
        communicationScore: typeof reportData.communicationScore === "number" ? reportData.communicationScore : 82,
        confidenceScore: typeof reportData.confidenceScore === "number" ? reportData.confidenceScore : 75,
        problemSolvingScore: typeof reportData.problemSolvingScore === "number" ? reportData.problemSolvingScore : 80,
        behavioralScore: typeof reportData.behavioralScore === "number" ? reportData.behavioralScore : 85,
        overallScore: typeof reportData.overallScore === "number" ? reportData.overallScore : 80,
        strengths: reportData.strengths || ["Strong architectural intuition", "Clear communication", "Structured problem-solving"],
        weaknesses: reportData.weaknesses || ["Could elaborate further on memory trade-offs", "Missed explicit metric bounds"],
        recruiterFeedback: reportData.recruiterFeedback || "The candidate shows strong technical aptitude for the target role.",
        hiringRecommendation: reportData.hiringRecommendation || "Hire",
        improvementPlan: reportData.improvementPlan || [
          "Week 1: Practice quantifying latency and throughput metrics in answers.",
          "Week 2: Deep dive into distributed cache invalidation strategies.",
          "Week 3: Practice mock system design loops with 45-minute strict time limits.",
          "Week 4: Review advanced concurrency and state synchronization patterns."
        ],
        suggestedTopics: reportData.suggestedTopics || ["System Design", "Concurrency", "Cache Invalidation", "REST APIs"],
        idealAnswers: reportData.idealAnswers || []
      };
    });
  }

  /** Evaluate Conversational English, Grammar, Pronunciation & Speaking Fluency */
  static async evaluateEnglishFluency(params: {
    currentQuestion: string;
    candidateSpeech: string;
    isFinalQuestion?: boolean;
  }) {
    const groq = getGroqClient();

    const systemPrompt = `You are a certified English Communication Coach & Senior HR Interviewer.
Evaluate the candidate's spoken English response like a real person taking an interview, assessing their English fluency, vocabulary, grammar, pronunciation, confidence, and filler word usage.

Evaluation Criteria (0-100 scale):
1. Grammar Score (0-100): Correct tense usage, subject-verb agreement, sentence structure.
2. Vocabulary Score (0-100): Word choice, professional vocabulary, avoidance of repetitive words.
3. Fluency & Pace Score (0-100): Flow of speech, rhythm, natural phrasing.
4. Confidence & Tone Score (0-100): Vocal expressiveness, confidence, presence.
5. Overall Speaking Score (0-100): Overall English proficiency.

Instructions:
- Provide 2-3 specific Grammar & Pronunciation Corrections.
- List any filler words used (e.g. "um", "like", "you know", "basically", "so").
- Give a warm, encouraging 2-sentence feedback statement about their English speaking performance.
- Generate a natural, conversational follow-up question (e.g. asking about background, introduction, career goals, or technical passion).

Return ONLY valid JSON:
{
  "grammarScore": <number 0-100>,
  "vocabularyScore": <number 0-100>,
  "fluencyScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "overallScore": <number 0-100>,
  "fillerWordsDetected": ["<word 1>", "<word 2>"],
  "corrections": ["<correction 1>", "<correction 2>"],
  "improvedPhrasing": "<fluent re-phrased response>",
  "feedback": "<warm English coach feedback>",
  "nextQuestion": "${params.isFinalQuestion ? "" : "<conversational follow-up question>"}"
}`;

    const userPrompt = `Current Question asked by interviewer: "${params.currentQuestion}"
Candidate Spoken Response: "${params.candidateSpeech}"

Evaluate English fluency and return JSON:`;

    return await withRetry(async () => {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1200
      });

      const raw = completion.choices[0]?.message?.content || "{}";
      const data = JSON.parse(raw);

      return {
        grammarScore: typeof data.grammarScore === "number" ? data.grammarScore : 82,
        vocabularyScore: typeof data.vocabularyScore === "number" ? data.vocabularyScore : 85,
        fluencyScore: typeof data.fluencyScore === "number" ? data.fluencyScore : 80,
        confidenceScore: typeof data.confidenceScore === "number" ? data.confidenceScore : 84,
        overallScore: typeof data.overallScore === "number" ? data.overallScore : 83,
        fillerWordsDetected: data.fillerWordsDetected || ["basically", "like"],
        corrections: data.corrections || ["Use active voice for project descriptions", "Maintain steady pacing between ideas"],
        improvedPhrasing: data.improvedPhrasing || "Hello! I am a full-stack software engineer with a strong passion for building scalable web applications...",
        feedback: data.feedback || "Great natural flow and clear articulation! Focusing on active transition words will elevate your spoken English.",
        nextQuestion: params.isFinalQuestion ? "" : data.nextQuestion || "Could you tell me about a project you are particularly proud of and what your key contributions were?"
      };
    });
  }
}
