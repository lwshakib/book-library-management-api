import { Book } from "../models/book.model.js";
import { Review } from "../models/review.model.js";
import { bookSchema } from "../schema/book.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBook = asyncHandler(async (req, res) => {
  // Extract book details from request body
  const {
    title,
    author,
    publishedDate,
    genre,
    summary,
    ISBN,
    buyHardCopyFrom,
    description,
  } = req.body;

  // Validate the request body using the book schema
  const parsedBody = bookSchema.safeParse({
    title,
    author,
    publishedDate,
    genre,
    summary,
    ISBN,
    buyHardCopyFrom,
    description,
  });
  if (!parsedBody.success) {
    return res.status(400).json({ errors: parsedBody.error.errors });
  }

  // Get file paths for cover image and PDF file
  const coverImage =
    req.files && req.files.coverImage && req.files.coverImage[0]
      ? req.files.coverImage[0].path
      : null;
  const pdfUrl =
    req.files && req.files.pdfFile && req.files.pdfFile[0]
      ? req.files.pdfFile[0].path
      : null;

  // Both files are required
  if (!coverImage || !pdfUrl) {
    return res.status(400).json({
      message: "Both cover image and PDF file are required.",
    });
  }

  // Create and save the new book
  let newBook;
  try {
    newBook = await Book.create({
      ...parsedBody.data,
      coverImage,
      pdfUrl,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create book.", error: error.message });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newBook, "Book created successfully"));
});

export const getBooks = asyncHandler(async (req, res) => {
  // Pagination parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Sorting
  const order = req.query.order === "desc" ? -1 : 1;
  let sortFields = req.query.field ? req.query.field.split(",") : ["createdAt"];
  const sortObj = {};
  sortFields.forEach((field) => {
    sortObj[field] = order;
  });

  // Field Selection
  let projection = null;
  if (req.query.field) {
    projection = req.query.field.split(",").join(" ");
  }

  // Total count for pagination
  const totalBooks = await Book.countDocuments();

  // Fetch books with sort, pagination, and selected fields
  const books = await Book.find()
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .select(projection);

  if (!books || books.length === 0) {
    return res.status(404).json({ message: "No books found." });
  }

  // Get review statistics for all books
  const bookIds = books.map((book) => book._id);
  const reviewStats = await Review.aggregate([
    {
      $match: {
        bookId: { $in: bookIds },
      },
    },
    {
      $group: {
        _id: "$bookId",
        reviewCount: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  // Create a map of bookId to review stats for easy lookup
  const reviewStatsMap = reviewStats.reduce((acc, stat) => {
    acc[stat._id.toString()] = {
      reviewCount: stat.reviewCount,
      averageRating: parseFloat(stat.averageRating.toFixed(1)),
    };
    return acc;
  }, {});

  // Add review stats to each book
  const booksWithReviews = books.map((book) => ({
    ...book.toObject(),
    reviewStats: reviewStatsMap[book._id.toString()] || {
      reviewCount: 0,
      averageRating: 0,
    },
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      booksWithReviews,
      "Books retrieved successfully",
      {
        total: totalBooks,
        page,
        limit,
        totalPages: Math.ceil(totalBooks / limit),
        hasNextPage: page * limit < totalBooks,
        hasPrevPage: page > 1,
      },
      {
        order: order === 1 ? "asc" : "desc",
        fields: req.query.field ? req.query.field.split(",") : [],
      }
    )
  );
});

export const getBookById = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  // Get book details
  const book = await Book.findById(bookId);
  if (!book) {
    return res
      .status(404)
      .json({ message: `Book with ID ${bookId} not found` });
  }

  // Get review statistics
  const reviewStats = await Review.aggregate([
    {
      $match: {
        bookId: book._id,
      },
    },
    {
      $group: {
        _id: "$bookId",
        reviewCount: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  // Get all reviews for the book with populated user information
  const reviews = await Review.find({ bookId })
    .populate({
      path: "userId",
      select: "username email avatar", // Include relevant user fields
    })
    .sort({ createdAt: -1 }); // Sort by newest first

  // Prepare the response with book details and reviews
  const bookWithReviews = {
    ...book.toObject(),
    reviewStats: reviewStats[0]
      ? {
          reviewCount: reviewStats[0].reviewCount,
          averageRating: parseFloat(reviewStats[0].averageRating.toFixed(1)),
        }
      : {
          reviewCount: 0,
          averageRating: 0,
        },
    reviews,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, bookWithReviews, "Book retrieved successfully"));
});

export const updateBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  // Logic to update a book by ID
  const {
    title,
    author,
    publishedDate,
    genre,
    summary,
    ISBN,
    buyHardCopyFrom,
    description,
  } = req.body;
  // Validate the request body using the book schema
  const parsedBody = bookSchema.safeParse({
    title,
    author,
    publishedDate,
    genre,
    summary,
    ISBN,
    buyHardCopyFrom,
    description,
  });
  if (!parsedBody.success) {
    return res.status(400).json({ errors: parsedBody.error.errors });
  }
  // Update the book in the database
  const updatedBook = await Book.findByIdAndUpdate(bookId, parsedBody.data, {
    new: true,
    runValidators: true,
  });
  if (!updatedBook) {
    return res
      .status(404)
      .json({ message: `Book with ID ${bookId} not found` });
  }
  // If book updated successfully, return it
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedBook,
        `Book with ID ${bookId} updated successfully`
      )
    );
});

export const deleteBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  // Logic to delete a book by ID
  const deletedBook = await Book.findByIdAndDelete(bookId);
  if (!deletedBook) {
    return res
      .status(404)
      .json({ message: `Book with ID ${bookId} not found` });
  }
  // If book deleted successfully, return success message
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        undefined,
        `Book with ID ${bookId} deleted successfully`
      )
    );
});

export const changeBookCover = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  // Get the new cover image file from request
  const coverImage =
    req.files && req.files.coverImage && req.files.coverImage[0]
      ? req.files.coverImage[0].path
      : null;

  // If no cover image provided, return error
  if (!coverImage) {
    return res.status(400).json({
      message: "Cover image is required.",
    });
  }

  // Update the book's cover image in the database
  const updatedBook = await Book.findByIdAndUpdate(
    bookId,
    { coverImage },
    { new: true, runValidators: true }
  );

  if (!updatedBook) {
    return res
      .status(404)
      .json({ message: `Book with ID ${bookId} not found` });
  }

  // If cover image updated successfully, return the updated book
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedBook,
        `Cover image for book with ID ${bookId} updated successfully`
      )
    );
});

export const changeBookPdf = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  // Get the new PDF file from request
  const pdfUrl =
    req.files && req.files.pdfFile && req.files.pdfFile[0]
      ? req.files.pdfFile[0].path
      : null;

  // If no PDF file provided, return error
  if (!pdfUrl) {
    return res.status(400).json({
      message: "PDF file is required.",
    });
  }

  // Update the book's PDF file in the database
  const updatedBook = await Book.findByIdAndUpdate(
    bookId,
    { pdfUrl },
    { new: true, runValidators: true }
  );

  if (!updatedBook) {
    return res
      .status(404)
      .json({ message: `Book with ID ${bookId} not found` });
  }

  // If PDF file updated successfully, return the updated book
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedBook,
        `PDF file for book with ID ${bookId} updated successfully`
      )
    );
});
