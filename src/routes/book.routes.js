import express from "express";
import {
  changeBookCover,
  changeBookPdf,
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
} from "../controllers/book.controller.js";
import { verifyAdmin } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

export const bookRouter = express.Router();

bookRouter.get("/", getBooks);
bookRouter.post(
  "/",
  verifyAdmin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
  ]),
  createBook
);
bookRouter.get("/:bookId", getBookById); // Assuming getBooks can handle both all books and a specific book by ID
bookRouter.patch("/:bookId", verifyAdmin, updateBook); // Assuming this is for updating a book by ID
bookRouter.delete("/:bookId", verifyAdmin, deleteBook); // Assuming this is for updating a book by ID

bookRouter.put(
  "/change-cover/:bookId",
  verifyAdmin,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  changeBookCover
); // Assuming this is for changing the cover image of a book by ID

bookRouter.put(
  "/change-pdf/:bookId",
  verifyAdmin,
  upload.fields([{ name: "pdfFile", maxCount: 1 }]),
  changeBookPdf
); // Assuming this is for changing the PDF of a book by ID
