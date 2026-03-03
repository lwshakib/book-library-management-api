import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  mock,
} from "bun:test";
import request from "supertest";
import { startDB, stopDB, clearDB } from "./helpers.js";

// Mock the email module so no real SMTP connections are made
mock.module("../src/utils/mail.js", () => ({
  sendEmail: async () => ({ success: true, messageId: "mocked" }),
  verifyEmailConfig: async () => true,
}));

import { httpServer } from "../src/app.js";

describe("Auth Routes", () => {
  beforeAll(async () => {
    await startDB();
  });

  afterAll(async () => {
    await stopDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  // ─── Sign Up ────────────────────────────────────────────────────────
  describe("POST /auth/sign-up", () => {
    const validUser = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    it("should create a new user and return 201", async () => {
      const res = await request(httpServer)
        .post("/auth/sign-up")
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(validUser.email);
    });

    it("should return 400 if passwords do not match", async () => {
      const res = await request(httpServer)
        .post("/auth/sign-up")
        .send({ ...validUser, confirmPassword: "differentpass" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if email is invalid", async () => {
      const res = await request(httpServer)
        .post("/auth/sign-up")
        .send({ ...validUser, email: "invalid-email" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is too short", async () => {
      const res = await request(httpServer)
        .post("/auth/sign-up")
        .send({ ...validUser, password: "12345", confirmPassword: "12345" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if name is missing", async () => {
      const res = await request(httpServer)
        .post("/auth/sign-up")
        .send({ ...validUser, name: "" });

      expect(res.status).toBe(400);
    });

    it("should return 409 if user already exists", async () => {
      // First sign-up
      await request(httpServer).post("/auth/sign-up").send(validUser);

      // Duplicate sign-up
      const res = await request(httpServer)
        .post("/auth/sign-up")
        .send(validUser);

      expect(res.status).toBe(409);
    });
  });

  // ─── Sign In ────────────────────────────────────────────────────────
  describe("POST /auth/sign-in", () => {
    const user = {
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    beforeEach(async () => {
      // Create the user before each sign-in test
      await request(httpServer).post("/auth/sign-up").send(user);
    });

    it("should sign in successfully and return accessToken", async () => {
      const res = await request(httpServer)
        .post("/auth/sign-in")
        .send({ email: user.email, password: user.password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user).toBeDefined();
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(httpServer)
        .post("/auth/sign-in")
        .send({ email: "nobody@example.com", password: "password123" });

      expect(res.status).toBe(404);
    });

    it("should return 401 for wrong password", async () => {
      const res = await request(httpServer)
        .post("/auth/sign-in")
        .send({ email: user.email, password: "wrongpassword" });

      expect(res.status).toBe(401);
    });

    it("should return 400 for invalid email format", async () => {
      const res = await request(httpServer)
        .post("/auth/sign-in")
        .send({ email: "not-an-email", password: "password123" });

      expect(res.status).toBe(400);
    });
  });

  // ─── Sign Out ───────────────────────────────────────────────────────
  describe("POST /auth/sign-out", () => {
    it("should sign out successfully with valid token", async () => {
      // Sign up + sign in
      const signUpUser = {
        name: "Signout Tester",
        email: "signout@example.com",
        password: "password123",
        confirmPassword: "password123",
      };
      await request(httpServer).post("/auth/sign-up").send(signUpUser);

      const signInRes = await request(httpServer)
        .post("/auth/sign-in")
        .send({ email: signUpUser.email, password: signUpUser.password });

      const token = signInRes.body.accessToken;

      const res = await request(httpServer)
        .post("/auth/sign-out")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 401 without a token", async () => {
      const res = await request(httpServer).post("/auth/sign-out");
      expect(res.status).toBe(401);
    });
  });

  // ─── Forgot Password ───────────────────────────────────────────────
  describe("POST /auth/forgot-password", () => {
    it("should send reset email for existing user", async () => {
      const user = {
        name: "Forgot Tester",
        email: "forgot@example.com",
        password: "password123",
        confirmPassword: "password123",
      };
      await request(httpServer).post("/auth/sign-up").send(user);

      const res = await request(httpServer)
        .post("/auth/forgot-password")
        .send({ email: user.email });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 for non-existent email", async () => {
      const res = await request(httpServer)
        .post("/auth/forgot-password")
        .send({ email: "nobody@example.com" });

      expect(res.status).toBe(404);
    });
  });

  // ─── Verify Email ─────────────────────────────────────────────────
  describe("POST /auth/verify-email", () => {
    it("should return 400 if code is missing", async () => {
      const res = await request(httpServer).post("/auth/verify-email").send({});

      expect(res.status).toBe(400);
    });

    it("should return 404 for invalid verification code", async () => {
      const res = await request(httpServer)
        .post("/auth/verify-email")
        .send({ verificationCode: "000000" });

      expect(res.status).toBe(404);
    });
  });

  // ─── Resend Verification Email ─────────────────────────────────────
  describe("POST /auth/resend-verification-email", () => {
    it("should return 400 if email is missing", async () => {
      const res = await request(httpServer)
        .post("/auth/resend-verification-email")
        .send({});

      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent email", async () => {
      const res = await request(httpServer)
        .post("/auth/resend-verification-email")
        .send({ email: "nobody@example.com" });

      expect(res.status).toBe(404);
    });
  });

  // ─── Verify Token ──────────────────────────────────────────────────
  describe("POST /auth/verify-token", () => {
    it("should verify a valid JWT", async () => {
      const user = {
        name: "Token Tester",
        email: "token@example.com",
        password: "password123",
        confirmPassword: "password123",
      };
      await request(httpServer).post("/auth/sign-up").send(user);

      const signInRes = await request(httpServer)
        .post("/auth/sign-in")
        .send({ email: user.email, password: user.password });

      const token = signInRes.body.accessToken;

      const res = await request(httpServer)
        .post("/auth/verify-token")
        .send({ token });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.decoded).toBeDefined();
    });

    it("should return 400 if token is missing", async () => {
      const res = await request(httpServer).post("/auth/verify-token").send({});

      expect(res.status).toBe(400);
    });

    it("should return 401 for an invalid token", async () => {
      const res = await request(httpServer)
        .post("/auth/verify-token")
        .send({ token: "invalid.jwt.token" });

      expect(res.status).toBe(401);
    });
  });
});
