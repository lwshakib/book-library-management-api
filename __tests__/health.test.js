import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import { startDB, stopDB } from "./helpers.js";
import { httpServer } from "../src/app.js";

describe("Health Check", () => {
  beforeAll(async () => {
    await startDB();
  });

  afterAll(async () => {
    await stopDB();
  });

  it("GET /health → 200 with healthy message", async () => {
    const response = await request(httpServer).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Server is healthy" });
  });
});
