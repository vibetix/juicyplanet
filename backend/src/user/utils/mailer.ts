// utils/mailer.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SSL
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendVerificationEmailParams {
  email: string;
  token: string; // now OTP
}

export const sendVerificationEmail = async ({ email, token }: SendVerificationEmailParams) => {
  const mailOptions = {
    from: `"JuicyPlanet 🧃" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your JuicyPlanet OTP Code ✨",
    html: `
      <div style="font-family: 'Arial', sans-serif; background-color: #fefce8; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #FFD54F, #FFF3C2); color: #00C896; padding: 30px 20px; text-align: center;">
            <span style="font-size: 42px;">🧃</span>
            <h1 style="margin: 0; font-size: 28px;">JuicyPlanet</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Fresh. Fruity. Feel-Good 🍹</p>
          </div>

          <!-- Body -->
          <div style="padding: 30px 20px; text-align: center;">
            <h2 style="color: #333333;">Your Verification Code</h2>
            <p style="color: #555555; font-size: 16px;">
              Use the OTP below to verify your JuicyPlanet account.
            </p>
            <div style="margin: 25px 0;">
              <span style="display: inline-block; background-color: #FF6B00; color: #fff; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 10px; letter-spacing: 4px;">
                ${token}
              </span>
            </div>
            <p style="color: #888888; font-size: 14px;">
              This code will expire in 15 minutes. If you didn’t request this, please ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #FFF0DC; padding: 20px; text-align: center; font-size: 13px; color: #888888;">
            <p style="margin: 0;">© ${new Date().getFullYear()} JuicyPlanet. All rights reserved.</p>
            <p style="margin: 5px 0 0;">Stay juicy 🍊</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send OTP email:`, error);
    throw new Error("Failed to send verification email");
  }
};
