export type AppView =
  | "landing"
  | "login"
  | "signup"
  | "google-auth"
  | "github-auth"
  | "otp-verification"
  | "forgot-password"
  | "dashboard";

export interface UserSession {
  name: string;
  email: string;
  college?: string;
  authMethod: "email" | "google" | "github";
  token?: string;
  targetRole?: string;
}
