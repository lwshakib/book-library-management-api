import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Book } from "../models/book.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the JSON file
const booksData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/books.json"), "utf-8")
);

export const addBooks = async (req, res) => {
  try {
    // Check if books already exist
    const existingBooks = await Book.find();
    if (existingBooks.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Books already exist in the database",
      });
    }

    // Insert all books
    const books = await Book.insertMany(booksData);

    res.status(201).json({
      success: true,
      message: "Books added successfully",
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Error adding books:", error);
    res.status(500).json({
      success: false,
      message: "Error adding books to database",
      error: error.message,
    });
  }
};
