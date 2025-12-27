import { config } from "dotenv";
import nodemailer from "nodemailer";
import { SendMailEnum } from "../constants.js";

// Import email templates
import {
  resetPasswordTemplate,
  signInTemplate,
  tooManyFailedLoginsTemplate,
  verifyEmailSuccessTemplate,
  verifyEmailTemplate,
  welcomeTemplate,
} from "./templates/index.js";

config();

const isDevelopment = process.env.NODE_ENV === "development";

const transporter = nodemailer.createTransport(
  isDevelopment
    ? {
        host: process.env.MAILHOG_SMTP_HOST || "localhost",
        port: Number(process.env.MAILHOG_SMTP_PORT) || 1025,
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
      }
    : {
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      }
);

export const sendEmail = async (purpose, context) => {
  try {
    let subject = "";
    let html = "";
    let text = "";

    if (purpose === SendMailEnum.VERIFY_EMAIL) {
      subject = "Verify Your Email Address - OpenLibrary";
      const template = verifyEmailTemplate(context);
      html = template.html;
      text = template.text;
    } else if (purpose === SendMailEnum.SIGN_IN) {
      subject = "Security Alert - New Sign-in Detected";
      const template = signInTemplate(context);
      html = template.html;
      text = template.text;
    } else if (purpose === SendMailEnum.RESET_PASSWORD) {
      subject = "Password Reset Request - OpenLibrary";
      const template = resetPasswordTemplate(context);
      html = template.html;
      text = template.text;
    } else if (purpose === SendMailEnum.TOO_MANY_FAILED_LOGIN_ATTEMPTS) {
      subject = "Security Alert - Account Temporarily Locked";
      const template = tooManyFailedLoginsTemplate(context);
      html = template.html;
      text = template.text;
    } else if (purpose === SendMailEnum.VERIFY_EMAIL_SUCCESS) {
      subject = "Email Verified Successfully - OpenLibrary";
      const template = verifyEmailSuccessTemplate(context);
      html = template.html;
      text = template.text;
    } else if (purpose === SendMailEnum.WELCOME) {
      subject = "Welcome to OpenLibrary!";
      const template = welcomeTemplate(context);
      html = template.html;
      text = template.text;
    } else {
      throw new Error("Unsupported email purpose");
    }

    const mailOptions = {
      from: `OpenLibrary <${
        process.env.GMAIL_USER || "noreply@openlibrary.com"
      }>`,
      to: context.to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

    if (isDevelopment) {
      console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// Verify transporter configuration on startup
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email server configuration error:", error);
    return false;
  }
};
