import nodemailer from "nodemailer";
import { logger } from "./logger.js";

/**
 * Type contract for input parameters accepted by sendPasswordResetEmail.
 * @typedef {Object} PasswordResetEmailInput
 * @property {string} to - Recipient email address.
 * @property {string} resetUrl - Single-use password reset link.
 * @property {string} [username] - Optional username of the recipient.
 */

/**
 * Type contract for the asynchronous delivery result of an email dispatch.
 * @typedef {Object} EmailDeliveryResult
 * @property {string} messageId - Unique message identifier returned by the SMTP server.
 * @property {string[]} [accepted] - Array of recipient email addresses accepted by SMTP transport.
 * @property {string[]} [rejected] - Array of recipient email addresses rejected by SMTP transport.
 * @property {string} [response] - Final status response string from the SMTP transport.
 * @property {Object} [envelope] - Message envelope metadata.
 */

/**
 * Creates and configures the Nodemailer SMTP transporter.
 * Enforces implicit TLS for port 465 and requires STARTTLS for all non-465 ports.
 *
 * @returns {import("nodemailer").Transporter}
 */
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    logger.warn("Email credentials (EMAIL_USER / EMAIL_PASS) are not configured in environment.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Checked type contract for the exported Nodemailer transporter instance.
 * @type {import("nodemailer").Transporter}
 */
export const transporter = createTransporter();

/**
 * Sends a password reset email to the specified user.
 *
 * @param {PasswordResetEmailInput} input - Parameters for password reset dispatch.
 * @returns {Promise<EmailDeliveryResult>} Delivery result containing messageId and SMTP details.
 */
export const sendPasswordResetEmail = async ({ to, resetUrl, username }) => {
  const mailOptions = {
    from: `"Notiq Support" <${process.env.EMAIL_USER || "no-reply@notiq.app"}>`,
    to,
    subject: "Reset your Notiq password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your Notiq password</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 0; }
            .container { max-width: 560px; margin: 40px auto; background-color: #111827; border-radius: 16px; border: 1px solid #1f2937; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }
            .header { padding: 32px 32px 20px; text-align: center; background: linear-gradient(180deg, rgba(34, 211, 238, 0.08) 0%, rgba(17, 24, 39, 0) 100%); }
            .logo { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; text-decoration: none; }
            .logo span { color: #22d3ee; }
            .content { padding: 20px 32px 32px; color: #cbd5e1; font-size: 15px; line-height: 1.6; }
            .greeting { font-size: 18px; font-weight: 600; color: #f8fafc; margin-bottom: 16px; }
            .button-wrapper { text-align: center; margin: 32px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff !important; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.4); }
            .notice { font-size: 13px; color: #94a3b8; background-color: rgba(30, 41, 59, 0.7); border-left: 3px solid #22d3ee; padding: 12px 16px; border-radius: 6px; margin: 24px 0; }
            .footer { padding: 24px 32px; background-color: #0d131f; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #1f2937; }
            .url-fallback { word-break: break-all; color: #38bdf8; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Not<span>iq</span>.</div>
            </div>
            <div class="content">
              <div class="greeting">Hello ${username || "there"},</div>
              <p>We received a request to reset the password for your Notiq account. Click the button below to choose a new password:</p>

              <div class="button-wrapper">
                <a href="${resetUrl}" class="button" target="_blank">Reset My Password</a>
              </div>

              <div class="notice">
                <strong>Security Notice:</strong> This link is single-use and will expire in <strong>15 minutes</strong>. If you did not request a password reset, you can safely ignore this email — your account remains secure and your password unchanged.
              </div>

              <p style="font-size: 13px; color: #94a3b8;">If the button above doesn't work, copy and paste this link into your browser:</p>
              <p class="url-fallback"><a href="${resetUrl}" style="color: #38bdf8;">${resetUrl}</a></p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Notiq. All rights reserved.<br/>
              Empowering your notes and productivity.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info({ messageId: info.messageId, to }, "Password reset email sent successfully");
  return info;
};
