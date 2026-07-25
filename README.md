# NexHire — Enterprise AI Career & Technical Interview Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose--9.8-green.svg)](https://www.mongodb.com/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-Llama%203.3%2070B-orange.svg)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

NexHire is a production-grade, full-stack AI career platform designed to empower software engineers, technical candidates, and job seekers. Built with modern web architecture and state-of-the-art Large Language Models (LLMs), NexHire provides real-time AI mock interviews with speech recognition and voice synthesis, 24/7 AI technical mentorship, and deep ATS resume optimization.

---

## 🌟 Key Product Pillars

### 1. 🎙️ NexInterview — Real-Time Voice AI Mock Interview & Fluency Coach
- **Dual Interviewer Modes**:
  - **Technical Role Interview**: Simulates FAANG-level engineering interview loops across System Design, Frontend, Backend, and Data Structures & Algorithms.
  - **Conversational English & Vocal Fluency Mode**: Evaluates spoken English fluency, vocabulary richness, sentence structure, and filler word usage (*"um"*, *"like"*, *"basically"*).
- **Speech-to-Text (STT) & Voice Output (TTS)**:
  - Captures real microphone voice streams and transcribes speech using **Groq Whisper** (`whisper-large-v3`).
  - Speaks questions and feedback out loud using natural human voice synthesis (`SpeechSynthesisUtterance`).
- **8-Vector Evaluation Matrix**:
  - Evaluates candidate answers in real time across Technical Accuracy, Communication, Confidence, Clarity, Depth, Structure, Examples Used, and Problem Solving (0–100 scale).
- **Adaptive Question Flow**:
  - Dynamically increases difficulty for strong answers or provides clarifying hints and principal engineer solution models for weaker responses.
- **Single Unified Database (`UnifiedMockInterview`)**:
  - Stores all live session states, complete conversation transcripts, and final AI reports in a single MongoDB collection.

### 2. 🤖 NexMentor — Technical Mentorship Chatbot
- **Dual LLM Architecture**:
  - Primary LLM: **Groq AI (Llama 3.3 70B)** for lightning-fast inference (<500ms TTFT).
  - Fallback LLM: **Google Gemini 2.5 Flash**.
- **Multi-Turn Context & Code Rendering**:
  - Maintains conversation memory across technical topics (DSA complexity analysis, System Design trade-offs, code reviews).
  - Automatically parses markdown syntax, rendering executable code blocks with one-click copy functionality.

### 3. 📄 NexResume — AI ATS Resume Studio
- **Multi-Tier File Parsing Pipeline**:
  - Extracts text from PDF and DOCX files using a resilient multi-strategy parser (`pdf-parse@2.x` class instantiation with raw stream regex fallbacks).
- **Automated ATS & Recruiter Evaluation**:
  - Calculates ATS Compatibility Score, Skills Match vs. Missing Skills, Recruiter Verdict, and Actionable Line-by-Line Fixes.

---

## 🏗️ Architecture & Project Structure

The codebase enforces **Clean Architecture** (Separation of Concerns: Controllers, Services, Models, Routes, and Frontend Components):

```
nexhire/
├── server/                       # Node.js / Express Backend Engine
│   ├── controllers/              # Thin HTTP Request Controllers
│   │   └── interviewController.ts # Validation & Status Code Handlers
│   ├── models/                   # Mongoose Database Schemas
│   │   └── MockInterview.ts      # Unified Mock Interview Schema (UnifiedMockInterview)
│   ├── services/                 # Business Logic Layer
│   │   ├── aiInterviewService.ts # Groq Llama 3.3 70B & Whisper large-v3 Client
│   │   └── interviewService.ts   # Interview State & History Management
│   ├── middleware/               # Auth & Security Middlewares
│   │   └── auth.ts               # JWT Session Verification
│   ├── routes/                   # Express API Routers
│   │   ├── auth.ts               # Authentication & OAuth Routes
│   │   ├── interview.ts          # Interview & Fluency Pipeline API
│   │   ├── mentor.ts             # NexMentor AI Chatbot API
│   │   └── resume.ts             # PDF/DOCX Resume Parsing & ATS API
│   └── db.ts                     # Database Connections & Core Schemas
│
├── src/                          # React 19 Frontend Application
│   ├── components/               # Production UI Components
│   │   ├── AIMockInterview.tsx   # NexInterview Studio & Audio Engine
│   │   ├── AIResumeStudio.tsx    # Resume Upload & ATS Dashboard
│   │   └── NexMentor.tsx         # NexMentor AI Chatbot Interface
│   ├── pages/                    # Route Pages (Dashboard, Login, Signup)
│   └── index.css                 # Tailwind CSS Design Tokens & Utilities
│
├── server.ts                     # Express Core Entry Point & Vite Integration
├── package.json                  # Dependencies & Scripts
├── tsconfig.json                 # TypeScript Configuration
└── vite.config.ts                # Vite Frontend Bundler Configuration
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Motion (Framer), Lucide Icons |
| **Styling & Aesthetics** | Tailwind CSS v4, Dark Theme Tokens, Micro-animations |
| **Backend Runtime** | Node.js, Express.js |
| **Database & ORM** | MongoDB, Mongoose 9.x |
| **AI Inference** | Groq AI (`llama-3.3-70b-versatile`), Google Gemini (`gemini-2.5-flash`) |
| **Speech Processing** | Groq Whisper (`whisper-large-v3`), Web Speech Synthesis (TTS) |
| **File Processing** | `pdf-parse@2.x`, `mammoth` (DOCX text extraction) |
| **Build Tools** | Vite 6.x (Client), Esbuild (Server bundle) |

---

## 🔌 API Endpoint Reference

### NexInterview Pipeline
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/interview/start` | Initialize interview session & generate initial AI question |
| `POST` | `/api/interview/transcribe` | Transcribe audio stream using Groq Whisper (`whisper-large-v3`) |
| `POST` | `/api/interview/answer` | Submit answer for 8-vector AI evaluation & follow-up generation |
| `POST` | `/api/interview/english-fluency` | Evaluate spoken English grammar, vocabulary, fluency & filler words |
| `POST` | `/api/interview/end` | Generate final comprehensive report & 30-day plan |
| `GET` | `/api/interview/history` | Retrieve candidate's past interview records |

### NexMentor & Resume
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/mentor/chat` | Multi-turn Groq/Gemini AI technical mentorship query |
| `POST` | `/api/resume/analyze` | Parse PDF/DOCX resume & evaluate ATS compatibility |

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm** or **bun**
- **MongoDB**: Local instance or MongoDB Atlas URI

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/theArshGupta/Nexhire.git
cd Nexhire
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mitmima.mongodb.net/test
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

### 4. Running Development Server
Start the development server with hot-module reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Deployment

### Build Command
Compile both client assets and server bundle:
```bash
npm run build
```

### Start Server
Run the production bundle:
```bash
npm run start
```

### Deployment Configuration
- **Render / Railway / VPS**:
  - Build Command: `npm run build`
  - Start Command: `npm run start`
- **Vercel / Netlify**:
  - Root directory: `./`
  - Configure environment variables in the project settings dashboard.

---

## 🛡️ Security & Environment Best Practices
- Secret keys (`GROQ_API_KEY`, `GEMINI_API_KEY`, `MONGODB_URI`, `JWT_SECRET`) are strictly excluded via `.gitignore`.
- `.env.example` provides a clean configuration template for open-source contributors.
- API endpoints are protected using JWT token verification (`authenticate` middleware).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
