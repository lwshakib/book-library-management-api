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
import { Favorite } from "../src/models/favorite.model.js";

describe("Favorite Routes", () => {
  let userToken;
  let userProfile;
  let testBook;
  let testBook2;

  beforeAll(async () => {
    await startDB();
  });

  afterAll(async () => {
    await stopDB();
  });

  beforeEach(async () => {
    await clearDB();

    const user = await createTestUser({
      name: "Fav User",
      email: "fav@example.com",
    });
    userToken = user.accessToken;
    userProfile = user.profile;

    testBook = await Book.create({
      title: "Fav Book 1",
      author: "Author 1",
      publishedDate: new Date("2024-01-01"),
      genre: "Fiction",
      summary: "Summary 1",
      description: "Description 1",
      ISBN: `ISBN-FAV-${Date.now()}-1`,
      coverImage: "cover1.jpg",
      pdfUrl: "file1.pdf",
    });

    testBook2 = await Book.create({
      title: "Fav Book 2",
      author: "Author 2",
      publishedDate: new Date("2024-06-01"),
      genre: "Mystery",
      summary: "Summary 2",
      description: "Description 2",
      ISBN: `ISBN-FAV-${Date.now()}-2`,
      coverImage: "cover2.jpg",
      pdfUrl: "file2.pdf",
    });
  });

  // ─── POST /favorites/:bookId ────────────────────────────────────────
  describe("POST /favorites/:bookId", () => {
    it("should add a book to favorites", async () => {
      const res = await request(httpServer)
        .post(`/favorites/${testBook._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bookId).toBe(testBook._id.toString());
    });

    it("should return 400 if book is already favorited", async () => {
      // Favorite once
      await request(httpServer)
        .post(`/favorites/${testBook._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      // Try again
      const res = await request(httpServer)
        .post(`/favorites/${testBook._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(400);
    });

    it("should return 401 without auth", async () => {
      const res = await request(httpServer).post(`/favorites/${testBook._id}`);

      expect(res.status).toBe(401);
    });
  });

  // ─── GET /favorites ─────────────────────────────────────────────────
  describe("GET /favorites", () => {
    it("should return user's favorite books", async () => {
      await Favorite.create({
        bookId: testBook._id,
        userId: userProfile._id,
      });
      await Favorite.create({
        bookId: testBook2._id,
        userId: userProfile._id,
      });

      const res = await request(httpServer)
        .get("/favorites")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
    });

    it("should return 404 when user has no favorites", async () => {
      const res = await request(httpServer)
        .get("/favorites")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });

    it("should return 401 without auth", async () => {
      const res = await request(httpServer).get("/favorites");
      expect(res.status).toBe(401);
    });
  });

  // ─── DELETE /favorites/:bookId ──────────────────────────────────────
  describe("DELETE /favorites/:bookId", () => {
    it("should remove a book from favorites", async () => {
      await Favorite.create({
        bookId: testBook._id,
        userId: userProfile._id,
      });

      const res = await request(httpServer)
        .delete(`/favorites/${testBook._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);

      const check = await Favorite.findOne({
        bookId: testBook._id,
        userId: userProfile._id,
      });
      expect(check).toBeNull();
    });

    it("should return 404 if book is not in favorites", async () => {
      const res = await request(httpServer)
        .delete(`/favorites/${testBook._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });

    it("should return 401 without auth", async () => {
      const res = await request(httpServer).delete(
        `/favorites/${testBook._id}`,
      );

      expect(res.status).toBe(401);
    });
  });
});
