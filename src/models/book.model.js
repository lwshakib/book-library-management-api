import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publishedDate: {
      type: Date,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Science Fiction",
        "Fantasy",
        "Biography",
        "History",
        "Mystery",
        "Romance",
        "Horror",
        "Programming",
        "Other",
      ],
    },
    summary: {
      type: String,
      trim: true,
      default: "",
    },
    ISBN: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    coverImage: {
      type: String,
      trim: true,
      default: "",
    },
    pdfUrl: {
      type: String,
      trim: true,
      default: "",
    },
    buyHardCopyFrom: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const Book = mongoose.model("books", bookSchema);
