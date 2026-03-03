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
import { Review } from "../src/models/review.model.js";

describe("Review Routes", () => {
  let userToken;
  let userProfile;
  let otherUserToken;
  let otherUserProfile;
  let testBook;

  beforeAll(async () => {
    await startDB();
  });

  afterAll(async () => {
    await stopDB();
  });

  beforeEach(async () => {
    await clearDB();

    const user1 = await createTestUser({
      name: "Reviewer",
      email: "reviewer@example.com",
    });
    userToken = user1.accessToken;
    userProfile = user1.profile;

    const user2 = await createTestUser({
      name: "Other User",
      email: "other@example.com",
    });
    otherUserToken = user2.accessToken;
    otherUserProfile = user2.profile;

    testBook = await Book.create({
      title: "Reviewable Book",
      author: "Author",
      publishedDate: new Date("2024-01-01"),
      genre: "Fiction",
      summary: "Summary",
      description: "Description",
      ISBN: `ISBN-${Date.now()}`,
      coverImage: "cover.jpg",
      pdfUrl: "file.pdf",
    });
  });

  // ─── POST /reviews/:bookId ──────────────────────────────────────────
  describe("POST /reviews/:bookId", () => {
    it("should create a review", async () => {
      const res = await request(httpServer)
        .post(`/reviews/${testBook._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ rating: 5, comment: "Excellent book!" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(5);
      expect(res.body.data.comment).toBe("Excellent book!");
    });

    it("should return 400 if rating is missing", async () => {
      const res = await request(httpServer)
        .post(`/reviews/${testBook._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ comment: "No rating" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if comment is missing", async () => {
      const res = await request(httpServer)
        .post(`/reviews/${testBook._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ rating: 4 });

      expect(res.status).toBe(400);
    });

    it("should return 404 if book does not exist", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(httpServer)
        .post(`/reviews/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ rating: 3, comment: "Ghost book" });

      expect(res.status).toBe(404);
    });

    it("should return 401 without auth", async () => {
      const res = await request(httpServer)
        .post(`/reviews/${testBook._id}`)
        .send({ rating: 3, comment: "No auth" });

      expect(res.status).toBe(401);
    });
  });

  // ─── GET /reviews/:bookId ──────────────────────────────────────────
  describe("GET /reviews/:bookId", () => {
    it("should return reviews for a book", async () => {
      await Review.create({
        bookId: testBook._id,
        userId: userProfile._id,
        rating: 4,
        comment: "Good read",
      });

      const res = await request(httpServer)
        .get(`/reviews/${testBook._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].comment).toBe("Good read");
    });

    it("should return empty array for book with no reviews", async () => {
      const res = await request(httpServer)
        .get(`/reviews/${testBook._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });

    it("should respect pagination", async () => {
      // Create 5 reviews
      for (let i = 0; i < 5; i++) {
        await Review.create({
          bookId: testBook._id,
          userId: userProfile._id,
          rating: i + 1,
          comment: `Review ${i + 1}`,
        });
      }

      const res = await request(httpServer)
        .get(`/reviews/${testBook._id}?page=1&limit=2`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.totalReviews).toBe(5);
    });
  });

  // ─── PUT /reviews/:reviewId ─────────────────────────────────────────
  describe("PUT /reviews/:reviewId", () => {
    it("should update own review", async () => {
      const review = await Review.create({
        bookId: testBook._id,
        userId: userProfile._id,
        rating: 3,
        comment: "Original",
      });

      const res = await request(httpServer)
        .put(`/reviews/${review._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ rating: 5, comment: "Updated!" });

      expect(res.status).toBe(200);
      expect(res.body.data.rating).toBe(5);
      expect(res.body.data.comment).toBe("Updated!");
    });

    it("should return 403 when updating another user's review", async () => {
      const review = await Review.create({
        bookId: testBook._id,
        userId: userProfile._id,
        rating: 4,
        comment: "My review",
      });

      const res = await request(httpServer)
        .put(`/reviews/${review._id}`)
        .set("Authorization", `Bearer ${otherUserToken}`)
        .send({ rating: 1, comment: "Hijacked!" });

      expect(res.status).toBe(403);
    });

    it("should return 404 for non-existent review", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(httpServer)
        .put(`/reviews/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ rating: 5, comment: "Ghost review" });

      expect(res.status).toBe(404);
    });
  });

  // ─── DELETE /reviews/:reviewId ──────────────────────────────────────
  describe("DELETE /reviews/:reviewId", () => {
    it("should delete own review", async () => {
      const review = await Review.create({
        bookId: testBook._id,
        userId: userProfile._id,
        rating: 2,
        comment: "Delete me",
      });

      const res = await request(httpServer)
        .delete(`/reviews/${review._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);

      const check = await Review.findById(review._id);
      expect(check).toBeNull();
    });

    it("should return 403 when deleting another user's review", async () => {
      const review = await Review.create({
        bookId: testBook._id,
        userId: userProfile._id,
        rating: 3,
        comment: "Not yours",
      });

      const res = await request(httpServer)
        .delete(`/reviews/${review._id}`)
        .set("Authorization", `Bearer ${otherUserToken}`);

      expect(res.status).toBe(403);
    });

    it("should return 404 for non-existent review", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(httpServer)
        .delete(`/reviews/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });
});
