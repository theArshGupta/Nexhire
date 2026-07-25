import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT) || 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

let transporter: nodemailer.Transporter | null = null;

const hasCredentials = user && pass && !user.includes("YOUR_") && !pass.includes("YOUR_") && user.trim() !== "" && pass.trim() !== "";

if (hasCredentials) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOTP(to: string, otp: string): Promise<boolean> {
  if (!transporter) {
    console.log(`\n========================================\n[DEV MODE] OTP Code for ${to}: ${otp}\n========================================\n`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"NexHire Placement Platform" <${user}>`,
      to,
      subject: "NexHire - Email Verification Code",
      text: `Your 6-digit NexHire email verification code is: ${otp}. This code is valid for 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #fafafa;">
          <h2 style="color: #4f46e5; text-align: center;">NexHire Verification Code</h2>
          <p style="font-size: 14px; color: #374151;">Hello,</p>
          <p style="font-size: 14px; color: #374151;">Thank you for registering on NexHire. Please use the following 6-digit verification code to complete your signup process:</p>
          <div style="margin: 30px 0; text-align: center;">
            <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 4px; padding: 10px 20px; background-color: #e0e7ff; color: #4338ca; border-radius: 8px;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 30px;">If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });
    console.log(`OTP email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error(`Failed to send OTP email to ${to}:`, error);
    return false;
  }
}
