/**
 * Example: How to integrate email sending into your authentication controllers
 *
 * This file demonstrates practical examples of using the email service
 * in various authentication scenarios.
 */

import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendVerificationSuccessEmail,
  sendPasswordResetEmail,
  sendSignInNotification,
  sendAccountLockoutNotification,
} from "../services/email.service.js";

// ============================================================================
// EXAMPLE 1: User Registration
// ============================================================================

export const registerUserExample = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // 1. Create user in database
    const user = await User.create({ email, name, password });

    // 2. Generate verification code
    const verificationCode = generateSixDigitCode();
    await saveVerificationCode(user.id, verificationCode);

    // 3. Send welcome email (non-blocking, won't throw)
    sendWelcomeEmail({
      email: user.email,
      name: user.name,
    });

    // 4. Send verification email (important, will throw on error)
    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationCode,
      expiresIn: "10 minutes",
    });

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for verification code.",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ============================================================================
// EXAMPLE 2: Email Verification
// ============================================================================

export const verifyEmailExample = async (req, res) => {
  try {
    const { email, code } = req.body;

    // 1. Verify the code
    const user = await User.findOne({ email });
    const isValid = await verifyCode(user.id, code);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // 2. Update user as verified
    user.isEmailVerified = true;
    await user.save();

    // 3. Send success notification (non-blocking)
    sendVerificationSuccessEmail({
      email: user.email,
      name: user.name,
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

// ============================================================================
// EXAMPLE 3: Password Reset Request
// ============================================================================

export const requestPasswordResetExample = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset code has been sent.",
      });
    }

    // 2. Generate reset code
    const resetCode = generateSixDigitCode();
    await savePasswordResetCode(user.id, resetCode);

    // 3. Send reset email
    await sendPasswordResetEmail({
      email: user.email,
      userName: user.name,
      resetCode,
      expiresIn: "15 minutes",
    });

    res.status(200).json({
      success: true,
      message: "If the email exists, a reset code has been sent.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
    });
  }
};

// ============================================================================
// EXAMPLE 4: User Login with Security Notification
// ============================================================================

export const loginUserExample = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and verify password
    const user = await User.findOne({ email });
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      // Track failed attempt
      await trackFailedLogin(user.id, req.ip);

      // Check if should lock account
      const failedAttempts = await getFailedLoginCount(user.id);

      if (failedAttempts >= 5) {
        // Lock account
        await lockUserAccount(user.id);

        // Send lockout notification
        sendAccountLockoutNotification({
          email: user.email,
          ipAddress: req.ip,
        });

        return res.status(423).json({
          success: false,
          message: "Account locked due to too many failed login attempts",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 2. Reset failed login attempts
    await resetFailedLoginCount(user.id);

    // 3. Generate auth token
    const token = generateAuthToken(user);

    // 4. Get location info (optional)
    const locationDetails = await getLocationFromIP(req.ip);

    // 5. Send sign-in notification (non-blocking)
    sendSignInNotification({
      email: user.email,
      name: user.name,
      ipAddress: req.ip,
      locationDetails,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ============================================================================
// EXAMPLE 5: Resend Verification Code
// ============================================================================

export const resendVerificationCodeExample = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // 2. Generate new code
    const verificationCode = generateSixDigitCode();
    await saveVerificationCode(user.id, verificationCode);

    // 3. Send verification email
    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationCode,
      expiresIn: "10 minutes",
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification code",
    });
  }
};

// ============================================================================
// Helper Functions (implement these based on your database)
// ============================================================================

const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const saveVerificationCode = async (userId, code) => {
  // Save to database with expiration
  // Example: await VerificationCode.create({ userId, code, expiresAt: Date.now() + 10*60*1000 });
};

const verifyCode = async (userId, code) => {
  // Verify code from database
  // Example: const record = await VerificationCode.findOne({ userId, code });
  // return record && record.expiresAt > Date.now();
};

const savePasswordResetCode = async (userId, code) => {
  // Save to database with expiration
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  // Use bcrypt or similar
  // return await bcrypt.compare(plainPassword, hashedPassword);
};

const trackFailedLogin = async (userId, ipAddress) => {
  // Track failed login attempt
};

const getFailedLoginCount = async (userId) => {
  // Get count of failed attempts in last X minutes
  return 0;
};

const lockUserAccount = async (userId) => {
  // Lock user account
};

const resetFailedLoginCount = async (userId) => {
  // Reset failed login counter
};

const generateAuthToken = (user) => {
  // Generate JWT or similar
  return "token";
};

const getLocationFromIP = async (ipAddress) => {
  // Use IP geolocation service (e.g., ipapi.co, ipinfo.io)
  // Example:
  // const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
  // return await response.json();
  return {
    city: "Unknown",
    region: "Unknown",
    country_name: "Unknown",
    timezone: "UTC",
    org: "Unknown",
  };
};
