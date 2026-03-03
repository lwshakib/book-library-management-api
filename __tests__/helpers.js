/**
 * Shared test helpers.
 *
 * • startDB()   – spins up MongoMemoryServer and connects Mongoose
 * • stopDB()    – drops the database, disconnects, and stops the server
 * • clearDB()   – drops every collection (use between tests)
 * • createTestUser() – creates an AuthenticatedUser + UserProfile pair
 * • getAuthToken()   – returns a valid JWT for the given auth user
 */

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { AuthenticatedUserModel } from "../src/models/auth/authenticated-user.model.js";
import { UserModel } from "../src/models/auth/user.model.js";

let mongoServer;

export async function startDB() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}

export async function stopDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}

export async function clearDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

/**
 * Creates both an AuthenticatedUser (credentials) and a UserModel (profile).
 * Returns { authUser, profile, accessToken }.
 */
export async function createTestUser(overrides = {}) {
  const data = {
    name: overrides.name || "Test User",
    email: overrides.email || `test-${Date.now()}@example.com`,
    password: overrides.password || "password123",
    role: overrides.role || "USER",
    verified: overrides.verified ?? true,
    type: "EMAIL",
  };

  const authUser = await AuthenticatedUserModel.create(data);

  const profile = await UserModel.create({
    authUserId: authUser._id,
    name: authUser.name,
    email: authUser.email,
    avatar: `https://placehold.co/600x400?text=${authUser.name.charAt(0).toUpperCase()}`,
  });

  const accessToken = authUser.generateAccessToken();

  return { authUser, profile, accessToken };
}
