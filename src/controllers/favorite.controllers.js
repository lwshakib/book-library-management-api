import { Favorite } from "../models/favorite.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const makeItMyFavorite = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  // Logic to add a book to favorites
  if (!bookId) {
    throw new ApiError(400, "Book ID is required");
  }
  const existingFavorite = await Favorite.findOne({
    bookId,
    userId: req.profile._id,
  });
  if (existingFavorite) {
    throw new ApiError(400, "Book already in favorites");
  }
  // Assuming we have a Favorite model to handle database operations
  const favorite = await Favorite.create({
    bookId,
    userId: req.profile._id, // Assuming req.user is populated with the authenticated user's info
  });
  if (!favorite) {
    throw new ApiError(500, "Failed to add favorite");
  }
  // Respond with success message

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        favorite,
        `Book with ID ${bookId} added to favorites`
      )
    );
});

export const getMyFavorites = asyncHandler(async (req, res) => {
  // Pagination parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalFavorites = await Favorite.countDocuments({
    userId: req.profile._id,
  });

  // Get paginated favorites
  const favorites = await Favorite.find({ userId: req.profile._id })
    .populate("bookId", "title author coverImage")
    .skip(skip)
    .limit(limit)
    .exec();

  if (!favorites || favorites.length === 0) {
    throw new ApiError(404, "No favorite books found");
  }

  return res.status(200).json(
    new ApiResponse(200, favorites, "Favorite books retrieved successfully", {
      total: totalFavorites,
      page,
      limit,
      totalPages: Math.ceil(totalFavorites / limit),
      hasNextPage: page * limit < totalFavorites,
      hasPrevPage: page > 1,
    })
  );
});

export const deleteFavorite = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  // Logic to remove a book from favorites
  if (!bookId) {
    throw new ApiError(400, "Book ID is required");
  }
  const existingFavorite = await Favorite.findOne({
    bookId,
    userId: req.profile._id,
  });
  if (!existingFavorite) {
    throw new ApiError(404, `Book with ID ${bookId} not found in favorites`);
  }
  const favorite = await Favorite.findOneAndDelete({
    bookId,
    userId: req.profile._id, // Assuming req.user is populated with the authenticated user's info
  });
  if (!favorite) {
    throw new ApiError(404, `Book with ID ${bookId} not found in favorites`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        undefined,
        `Book with ID ${bookId} removed from favorites`
      )
    );
});
