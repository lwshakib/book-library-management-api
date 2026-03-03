import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import request from "supertest";
import { startDB, stopDB, clearDB, createTestUser } from "./helpers.js";
import { httpServer } from "../src/app.js";
import { Book } from "../src/models/book.model.js";

/** Helper: valid book payload */
const makeBook = (overrides = {}) => ({
  title: overrides.title || "Test Book",
  author: overrides.author || "Test Author",
  publishedDate: overrides.publishedDate || "2024-01-15",
  genre: overrides.genre || "Fiction",
  summary: overrides.summary || "A test book summary",
  ISBN: overrides.ISBN || `ISBN-${Date.now()}`,
  description:
    overrides.description || "A detailed description of the test book.",
  buyHardCopyFrom: overrides.buyHardCopyFrom || "https://example.com",
});

describe("Book Routes", () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    await startDB();
  });

  afterAll(async () => {
    await stopDB();
  });

  beforeEach(async () => {
    await clearDB();
    // Create an admin and a regular user before each test
    const admin = await createTestUser({
      name: "Admin",
      email: "admin@example.com",
      role: "ADMIN",
    });
    adminToken = admin.accessToken;

    const user = await createTestUser({
      name: "Regular User",
      email: "user@example.com",
      role: "USER",
    });
    userToken = user.accessToken;
  });

  // ─── GET /books ─────────────────────────────────────────────────────
  describe("GET /books", () => {
    it("should return books with pagination", async () => {
      // Seed some books directly
      await Book.create({
        ...makeBook({ ISBN: "ISBN-001" }),
        coverImage: "cover.jpg",
        pdfUrl: "file.pdf",
      });
      await Book.create({
        ...makeBook({ title: "Second Book", ISBN: "ISBN-002" }),
        coverImage: "cover2.jpg",
        pdfUrl: "file2.pdf",
      });

      const res = await request(httpServer)
        .get("/books")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(2);
    });

    it("should return 404 when no books exist", async () => {
      const res = await request(httpServer)
        .get("/books")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });

    it("should return 401 without auth token", async () => {
      const res = await request(httpServer).get("/books");
      expect(res.status).toBe(401);
    });

    it("should respect pagination params", async () => {
      // create 5 books
      for (let i = 1; i <= 5; i++) {
        await Book.create({
          ...makeBook({ title: `Book ${i}`, ISBN: `ISBN-P-${i}` }),
          coverImage: "c.jpg",
          pdfUrl: "f.pdf",
        });
      }

      const res = await request(httpServer)
        .get("/books?page=1&limit=2")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.total).toBe(5);
      expect(res.body.pagination.totalPages).toBe(3);
      expect(res.body.pagination.hasNextPage).toBe(true);
    });
  });

  // ─── GET /books/:bookId ─────────────────────────────────────────────
  describe("GET /books/:bookId", () => {
    it("should return a single book by ID", async () => {
      const book = await Book.create({
        ...makeBook(),
        coverImage: "cover.jpg",
        pdfUrl: "file.pdf",
      });

      const res = await request(httpServer)
        .get(`/books/${book._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Test Book");
      expect(res.body.data.reviewStats).toBeDefined();
    });

    it("should return 404 for non-existent book ID", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(httpServer)
        .get(`/books/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });

  // ─── PATCH /books/:bookId (Admin only) ──────────────────────────────
  describe("PATCH /books/:bookId", () => {
    it("should update a book as admin", async () => {
      const book = await Book.create({
        ...makeBook(),
        coverImage: "c.jpg",
        pdfUrl: "f.pdf",
      });

      const res = await request(httpServer)
        .patch(`/books/${book._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(makeBook({ title: "Updated Title" }));

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Updated Title");
    });

    it("should return 403 for non-admin user", async () => {
      const book = await Book.create({
        ...makeBook(),
        coverImage: "c.jpg",
        pdfUrl: "f.pdf",
      });

      const res = await request(httpServer)
        .patch(`/books/${book._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(makeBook({ title: "Hacked Title" }));

      expect(res.status).toBe(403);
    });

    it("should return 404 for non-existent book", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(httpServer)
        .patch(`/books/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(makeBook());

      expect(res.status).toBe(404);
    });
  });

  // ─── DELETE /books/:bookId (Admin only) ─────────────────────────────
  describe("DELETE /books/:bookId", () => {
    it("should delete a book as admin", async () => {
      const book = await Book.create({
        ...makeBook(),
        coverImage: "c.jpg",
        pdfUrl: "f.pdf",
      });

      const res = await request(httpServer)
        .delete(`/books/${book._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      // Verify it's gone
      const check = await Book.findById(book._id);
      expect(check).toBeNull();
    });

    it("should return 403 for non-admin user", async () => {
      const book = await Book.create({
        ...makeBook(),
        coverImage: "c.jpg",
        pdfUrl: "f.pdf",
      });

      const res = await request(httpServer)
        .delete(`/books/${book._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it("should return 404 for non-existent book", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(httpServer)
        .delete(`/books/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });
});
