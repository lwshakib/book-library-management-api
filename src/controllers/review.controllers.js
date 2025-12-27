import { Review } from "../models/review.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Book } from "../models/book.model.js";

export const giveAReview = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { rating, comment } = req.body;

  const existBook = await Book.findById(bookId);
  if (!existBook) {
    throw new ApiError(404, "Book not found.");
  }
  // Validate input
  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating and review are required." });
  }

  // Assuming we have a Review model to handle database operations
  const newReview = await Review.create({
    bookId,
    userId: req.profile._id,
    rating,
    comment,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newReview, "Review created successfully"));
});
export const getReviewsByBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  // Pagination parameters from query string, with defaults
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination info
  const totalReviews = await Review.countDocuments({ bookId });

  // Fetch paginated reviews
  const reviews = await Review.find({ bookId })
    .populate("userId", "name avatar")
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(200, reviews, "Reviews fetched successfully", {
      totalReviews,
      page,
      limit,
      totalPages: Math.ceil(totalReviews / limit),
      hasNextPage: page * limit < totalReviews,
      hasPrevPage: page > 1,
    })
  );
});
export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  // Assuming we have a Review model to handle database operations
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found.");
  }

  // Check if the user is authorized to delete the review
  if (review.userId.toString() !== req.profile._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this review.");
  }

  await review.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully", null));
});
export const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found.");
  }

  if (review.userId.toString() !== req.profile._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this review.");
  }
  // Validate input
  if (!rating || !comment) {
    throw new ApiError(400, "Rating and review are required.");
  }

  // Assuming we have a Review model to handle database operations
  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    { rating, comment },
    { new: true }
  );

  if (!updatedReview) {
    throw new ApiError(404, "Review not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedReview, "Review updated successfully"));
});
