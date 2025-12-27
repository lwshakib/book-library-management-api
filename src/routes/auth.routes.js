import express from "express";
import passport from "passport";
import {
  forgetPassword,
  handleSocialLogin,
  resendVerificationEmail,
  resetPassword,
  signIn,
  signOut,
  signUp,
  verifyEmail,
  verifyToken,
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

export const authRouter = express.Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/forgot-password", forgetPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/sign-out", verifyJWT, signOut);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-verification-email", resendVerificationEmail);
authRouter.post("/verify-token", verifyToken);
// SSO routes
authRouter.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to google...");
  }
);

authRouter.route("/github").get(
  passport.authenticate("github", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to github...");
  }
);

authRouter
  .route("/google/callback")
  .get(passport.authenticate("google"), handleSocialLogin);

authRouter
  .route("/github/callback")
  .get(passport.authenticate("github"), handleSocialLogin);
