import { sendEmail } from "../utils/mail.js";
import { SendMailEnum } from "../constants.js";

/**
 * Email Service - Helper functions for sending emails
 *
 * This service provides convenient wrapper functions for sending
 * different types of emails throughout the application.
 */

/**
 * Send email verification code to user
 * @param {Object} params - Email parameters
 * @param {string} params.email - User's email address
 * @param {string} params.name - User's name
 * @param {string} params.verificationCode - 6-digit verification code
 * @param {string} params.expiresIn - Expiration time (e.g., "10 minutes")
 */
export const sendVerificationEmail = async ({
  email,
  name,
  verificationCode,
  expiresIn = "10 minutes",
}) => {
  try {
    await sendEmail(SendMailEnum.VERIFY_EMAIL, {
      to: email,
      name,
      verificationCode,
      expiredAfter: expiresIn,
    });
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${email}:`, error);
    throw error;
  }
};

/**
 * Send welcome email to new user
 * @param {Object} params - Email parameters
 * @param {string} params.email - User's email address
 * @param {string} params.name - User's name
 */
export const sendWelcomeEmail = async ({ email, name }) => {
  try {
    await sendEmail(SendMailEnum.WELCOME, {
      to: email,
      name,
    });
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${email}:`, error);
    // Don't throw - welcome email failure shouldn't block user registration
  }
};

/**
 * Send email verification success notification
 * @param {Object} params - Email parameters
 * @param {string} params.email - User's email address
 * @param {string} params.name - User's name
 */
export const sendVerificationSuccessEmail = async ({ email, name }) => {
  try {
    await sendEmail(SendMailEnum.VERIFY_EMAIL_SUCCESS, {
      to: email,
      name,
    });
    console.log(`✅ Verification success email sent to ${email}`);
  } catch (error) {
    console.error(
      `❌ Failed to send verification success email to ${email}:`,
      error
    );
    // Don't throw - this is a non-critical notification
  }
};

/**
 * Send password reset email
 * @param {Object} params - Email parameters
 * @param {string} params.email - User's email address
 * @param {string} params.userName - User's name
 * @param {string} params.resetCode - Password reset code
 * @param {string} params.expiresIn - Expiration time (e.g., "15 minutes")
 */
export const sendPasswordResetEmail = async ({
  email,
  userName,
  resetCode,
  expiresIn = "15 minutes",
}) => {
  try {
    await sendEmail(SendMailEnum.RESET_PASSWORD, {
      to: email,
      userName,
      verificationCode: resetCode,
      expiredAfter: expiresIn,
    });
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${email}:`, error);
    throw error;
  }
};

/**
 * Send sign-in notification email
 * @param {Object} params - Email parameters
 * @param {string} params.email - User's email address
 * @param {string} params.name - User's name
 * @param {string} params.ipAddress - IP address of the sign-in
 * @param {Object} params.locationDetails - Location information
 */
export const sendSignInNotification = async ({
  email,
  name,
  ipAddress,
  locationDetails = {},
}) => {
  try {
    await sendEmail(SendMailEnum.SIGN_IN, {
      to: email,
      name,
      ipAddress,
      details: {
        city: locationDetails.city || "Unknown",
        region: locationDetails.region || "Unknown",
        country_name: locationDetails.country_name || "Unknown",
        timezone: locationDetails.timezone || "UTC",
        org: locationDetails.org || "Unknown",
        ip: ipAddress,
      },
    });
    console.log(`✅ Sign-in notification sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send sign-in notification to ${email}:`, error);
    // Don't throw - this is a non-critical notification
  }
};

/**
 * Send account lockout notification
 * @param {Object} params - Email parameters
 * @param {string} params.email - User's email address
 * @param {string} params.ipAddress - IP address of failed attempts
 */
export const sendAccountLockoutNotification = async ({ email, ipAddress }) => {
  try {
    await sendEmail(SendMailEnum.TOO_MANY_FAILED_LOGIN_ATTEMPTS, {
      to: email,
      ipAddress,
    });
    console.log(`✅ Account lockout notification sent to ${email}`);
  } catch (error) {
    console.error(
      `❌ Failed to send account lockout notification to ${email}:`,
      error
    );
    // Don't throw - user should still be locked out even if email fails
  }
};

/**
 * Example usage in authentication controller:
 *
 * // During user registration
 * await sendWelcomeEmail({
 *   email: user.email,
 *   name: user.name
 * });
 *
 * await sendVerificationEmail({
 *   email: user.email,
 *   name: user.name,
 *   verificationCode: code,
 *   expiresIn: "10 minutes"
 * });
 *
 * // After email verification
 * await sendVerificationSuccessEmail({
 *   email: user.email,
 *   name: user.name
 * });
 *
 * // During password reset request
 * await sendPasswordResetEmail({
 *   email: user.email,
 *   userName: user.name,
 *   resetCode: code,
 *   expiresIn: "15 minutes"
 * });
 *
 * // After successful login
 * await sendSignInNotification({
 *   email: user.email,
 *   name: user.name,
 *   ipAddress: req.ip,
 *   locationDetails: ipInfo
 * });
 *
 * // When account is locked
 * await sendAccountLockoutNotification({
 *   email: user.email,
 *   ipAddress: req.ip
 * });
 */
