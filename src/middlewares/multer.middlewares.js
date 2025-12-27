import multer from "multer";
import fs from "fs";
import path from "path";

// Configure storage settings for uploaded files
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files based on file type
  destination: function (req, file, cb) {
    let uploadPath = "";

    if (file.mimetype === "application/pdf") {
      uploadPath = "./public/pdf";
    } else {
      uploadPath = "./public/images";
    }

    // Ensure directory exists or create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  // Set the filename for uploaded files
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const random = Math.ceil(Math.random() * 1e5);
    const fileExtension = path.extname(file.originalname); // Safer way to extract extension

    let prefix = "file";
    if (file.mimetype === "application/pdf") {
      prefix = "pdf";
    } else if (file.mimetype.startsWith("image/")) {
      prefix = "image";
    }

    const newFileName = `${prefix}-${timestamp}-${random}${fileExtension}`;
    cb(null, newFileName);
  },
});

// File filter to allow only images and PDF files
function fileFilter(req, file, cb) {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and PDF files are allowed!"), false);
  }
}

// Export the multer upload middleware
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1000 * 1000, // 10MB limit
  },
  fileFilter,
});
