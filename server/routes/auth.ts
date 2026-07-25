import { Router, Request, Response } from "express";
import { db } from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { sendOTP } from "../utils/mailer.js";

const router = Router();

function getBaseUrl(req: Request): string {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string"
    ? forwardedProto.split(",")[0].trim()
    : (req.protocol || "https");
  const host = req.headers["x-forwarded-host"] || req.get("host");

  // If request arrives from a production domain, dynamically use incoming host
  if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    return `${protocol}://${host}`;
  }

  const configured = process.env.APP_URL?.replace(/\/$/, "");
  if (configured && !configured.includes("localhost")) {
    return configured;
  }

  return `${protocol}://${host || "localhost:3000"}`;
}

// POST /api/auth/signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password, college, graduationYear, targetRole } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const user = await db.createUser({
      name,
      email,
      password,
      college,
      graduationYear,
      targetRole
    });

    const token = await db.createSession(user.id);

    res.json({
      success: true,
      message: "Account created successfully",
      user,
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Signup failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValid = await db.validatePassword(email, password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = await db.createSession(user.id);

    res.json({
      success: true,
      message: "Login successful",
      user,
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Login failed" });
  }
});

// POST /api/auth/otp/send
router.post("/otp/send", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.saveOTP(email, generatedOtp);
    await sendOTP(email, generatedOtp);

    res.json({
      success: true,
      message: "OTP sent to your email address",
      demoOtp: generatedOtp
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to send OTP" });
  }
});

// POST /api/auth/otp/verify
router.post("/otp/verify", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const isValid = await db.verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser({ email });
    }

    const token = await db.createSession(user.id);

    res.json({
      success: true,
      message: "Verification successful",
      user,
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "OTP verification failed" });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    res.json({
      success: true,
      user: authReq.user
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to get user profile" });
  }
});

// POST /api/auth/social
router.post("/social", async (req: Request, res: Response) => {
  try {
    const { name, email, provider, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser({
        name: name || email.split("@")[0],
        email,
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        college: "Stanford University",
        targetRole: "Software Engineer"
      });
    }

    const token = await db.createSession(user.id);

    res.json({
      success: true,
      message: "Social login successful",
      user,
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Social login failed" });
  }
});

// --- Google OAuth Redirection & Callback ---

// GET /api/auth/google
router.get("/google", (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId.startsWith("YOUR_") || clientId.trim() === "") {
    return res.redirect("/google-auth");
  }
  const baseUrl = getBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent("profile email")}&access_type=online&prompt=select_account`;
  res.redirect(googleAuthUrl);
});

// GET /api/auth/google/callback
router.get("/google/callback", async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    const baseUrl = getBaseUrl(req);
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    const tokenData = await tokenResponse.json() as any;
    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description || "Token exchange failed" });
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const userData = await userResponse.json() as any;
    if (userData.error) {
      return res.status(400).json({ error: "Failed to fetch Google user profile" });
    }

    const email = userData.email;
    const name = userData.name || email.split("@")[0];
    const avatar = userData.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

    // Upsert user in MongoDB
    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser({
        name,
        email,
        avatar,
        college: "Stanford University",
        targetRole: "Software Engineer"
      });
    } else {
      await db.updateUser(user.id, { avatar });
    }

    // Create session token and redirect back to frontend
    const token = await db.createSession(user.id);
    res.redirect(`/?token=${token}`);
  } catch (error: any) {
    console.error("Google OAuth error:", error);
    res.status(500).json({ error: error.message || "Google Authentication failed" });
  }
});

// --- Real GitHub OAuth Redirection & Callback ---

// GET /api/auth/github
router.get("/github", (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId || clientId.startsWith("YOUR_") || clientId.trim() === "") {
    return res.redirect("/github-auth");
  }
  const baseUrl = getBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/github/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent("user:email")}&prompt=consent`;
  res.redirect(githubAuthUrl);
});

// GET /api/auth/github/callback
router.get("/github/callback", async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    const baseUrl = getBaseUrl(req);
    const redirectUri = `${baseUrl}/api/auth/github/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GITHUB_CLIENT_ID || "",
        client_secret: process.env.GITHUB_CLIENT_SECRET || "",
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenResponse.json() as any;
    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description || "GitHub Token exchange failed" });
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        "User-Agent": "NexHire-Auth"
      }
    });

    const userData = await userResponse.json() as any;
    if (!userData || !userData.login) {
      return res.status(400).json({ error: "Failed to fetch GitHub profile info" });
    }

    let email = userData.email;
    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `token ${accessToken}`,
          "User-Agent": "NexHire-Auth"
        }
      });
      const emailsList = await emailsResponse.json() as any[];
      if (Array.isArray(emailsList) && emailsList.length > 0) {
        const primaryEmail = emailsList.find(e => e.primary && e.verified) || emailsList[0];
        email = primaryEmail?.email;
      }
    }

    if (!email) {
      email = `${userData.login}@github.com`;
    }

    const name = userData.name || userData.login;
    const avatar = userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

    // Upsert user in MongoDB
    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser({
        name,
        email,
        avatar,
        college: "Stanford University",
        targetRole: "Software Engineer"
      });
    } else {
      await db.updateUser(user.id, { avatar });
    }

    // Create session token and redirect back to frontend
    const token = await db.createSession(user.id);
    res.redirect(`/?token=${token}`);
  } catch (error: any) {
    console.error("GitHub OAuth error:", error);
    res.status(500).json({ error: error.message || "GitHub Authentication failed" });
  }
});

// POST /api/auth/password/reset/request
router.post("/password/reset/request", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "No account found with this email address" });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.saveOTP(email, generatedOtp);
    await sendOTP(email, generatedOtp);

    res.json({
      success: true,
      message: "Reset code sent to your email address",
      demoOtp: generatedOtp
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to request password reset" });
  }
});

// POST /api/auth/password/reset/confirm
router.post("/password/reset/confirm", async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, code, and new password are required" });
    }

    const isValid = await db.verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    const success = await db.resetPassword(email, newPassword);
    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "Password reset successful. You can now log in with your new password."
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to reset password" });
  }
});

export default router;
