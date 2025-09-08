// utils/mailer.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SSL port
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendVerificationEmailParams {
  email: string;
  token: string;
}

export const sendVerificationEmail = async ({ email, token }: SendVerificationEmailParams) => {
  const verificationUrl = `${process.env.FRONTEND_BASE_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"JuicyPlanet 🧃" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirm Your JuicyPlanet Email ✨",
    html: `
      <div style="font-family: 'Arial', sans-serif; background-color: #fefce8; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #FFD54F, #FFF3C2); color: #00C896; padding: 30px 20px; text-align: center;">
            <span style="font-size: 40px;">🧃</span>
            <h1 style="margin: 0; font-size: 28px;">JuicyPlanet</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Fresh. Fruity. Feel-Good 🍹</p>
          </div>
          <div style="padding: 30px 20px; text-align: center;">
            <h2 style="color: #333333;">Confirm Your Email</h2>
            <p style="color: #555555; font-size: 16px;">Click below to activate your JuicyPlanet account.</p>
            <a href="${verificationUrl}" style="display: inline-block; margin-top: 25px; padding: 12px 25px; background-color: #FF6B00; color: white; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
              Confirm Email
            </a>
            <p style="margin-top: 30px; font-size: 14px; color: #888888;">
              Or paste this link into your browser:
            </p>
            <p style="word-break: break-all; font-size: 14px; color: #00C896;">${verificationUrl}</p>
          </div>
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
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send verification email:`, error);
    throw new Error("Failed to send verification email");
  }
};

interface SendContactNotificationParams {
  name: string;
  email: string;
  message: string;
}

export const sendContactNotification = async ({
  name,
  email,
  message,
}: SendContactNotificationParams) => {
  const mailOptions = {
    from: `"JuicyPlanet 🧃" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_NOTIFICATION_EMAIL,
    subject: `📩 New Contact Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #fefce8; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #FFD54F, #FFF3C2); color: #00C896; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 26px;">JuicyPlanet Contact Form</h1>
            <p style="margin: 5px 0 0; font-size: 14px;">Fresh. Fruity. Feel-Good 🍹</p>
          </div>
          <div style="padding: 25px; color: #333333;">
            <h2 style="margin-bottom: 10px;">New Message Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #f9f9f9; padding: 10px; border-radius: 8px;">${message}</p>
          </div>
          <div style="background-color: #FFF0DC; padding: 15px; text-align: center; font-size: 12px; color: #888888;">
            <p style="margin: 0;">© ${new Date().getFullYear()} JuicyPlanet. All rights reserved.</p>
            <p style="margin: 5px 0 0;">Stay juicy 🍊</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Contact notification sent for ${name}`);
  } catch (error) {
    console.error(`❌ Failed to send contact notification:`, error);
    throw new Error("Failed to send contact notification email");
  }
};
