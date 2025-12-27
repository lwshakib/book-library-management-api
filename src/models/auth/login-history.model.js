import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema(
  {
    authUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "authenticated-user",
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
    userAgent: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const LoginHistoryModel = mongoose.model(
  "login-histories",
  loginHistorySchema
);