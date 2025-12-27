import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "./user.model.js";
import { SendMailEnum } from "../../constants.js";
import { sendMail } from "../../utils/mail.js";

const authenticatedUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    type: {
      type: String,
      enum: ["EMAIL", "GOOGLE", "GITHUB", "FACEBOOK"],
      default: "EMAIL",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

authenticatedUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

authenticatedUserSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

authenticatedUserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, name: this.name, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    }
  );
};

authenticatedUserSchema.methods.generateTemporaryCode = function () {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const AuthenticatedUserModel = mongoose.model(
  "authenticated-users",
  authenticatedUserSchema
);
