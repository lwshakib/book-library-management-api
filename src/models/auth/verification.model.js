import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    authUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "authenticated-user",
      required: true,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "EXPIRED"],
      default: "PENDING",
    },
    type: {
      type: String,
      enum: ["EMAIL"],
      required: true,
    },
    for: {
      type: String,
      enum: ["RESET_PASSWORD", "VERIFY_EMAIL"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const VerificationModel = mongoose.model(
  "verifications",
  verificationSchema
);
