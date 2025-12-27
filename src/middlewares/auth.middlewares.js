import jwt from "jsonwebtoken";
import { AuthenticatedUserModel } from "../models/auth/authenticated-user.model.js";
import { UserModel } from "../models/auth/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");


  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await AuthenticatedUserModel.findById(decodedToken?.id).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!user) {
      // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
      // Then they will get a new access token which will allow them to refresh the access token without logging out the user
      throw new ApiError(401, "Invalid access token");
    }

    const profile = await UserModel.findOne({ authUserId: user._id });
    if (!profile) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    req.profile = profile;
    next();
  } catch (error) {
    // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
    // Then they will get a new access token which will allow them to refresh the access token without logging out the user
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user?.role || req.user.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden: Admin access required");
  }
  next();
});
