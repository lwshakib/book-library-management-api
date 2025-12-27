import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import session from "express-session";
import fs from "fs";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import path from "path";
import requestIp from "request-ip";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import YAML from "yaml";
import passport from "./passport/index.js";
// removed: UserRoleEnum (moved into passport module)
import morganMiddleware from "./logger/morgan.logger.js";
import { verifyAdmin, verifyJWT } from "./middlewares/auth.middlewares.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
// removed: direct model imports (handled in passport module)
import { Book } from "./models/book.model.js";
import { Favorite } from "./models/favorite.model.js";
import { Review } from "./models/review.model.js";
import { routes } from "./routes/index.js";
import { addBooks } from "./seeds/books.seeds.js";
import { ApiError } from "./utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.readFileSync(path.resolve(__dirname, "./swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(
  file?.replace(
    "- url: ${{server}}",
    `- url: ${process.env.BACKEND_URL || "http://localhost:7000"}`
  )
);

const app = express();
const httpServer = createServer(app);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_SSO_REDIRECT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies to be sent with requests
    preflightContinue: false,
  })
);

app.use(requestIp.mw());

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req, res) => {
    if (req.query.apiKey) return req.query.apiKey;
    return ipKeyGenerator(req.clientIp); // IP address from requestIp.mw(), as opposed to req.ip
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// passport strategies and serialization moved to ./passport/index.js

// required for passport
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(morganMiddleware);

app.post("/seeds/add-books", verifyJWT, verifyAdmin, addBooks);
app.use(routes);

// Root page rendering using EJS
app.get("/", async (req, res, next) => {
  try {
    const accessToken = req.query.accessToken;
    if (accessToken) {
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      return res.redirect("/");
    }

    if (!req.cookies?.accessToken) {
      return res.redirect("/sign-in");
    }

    // Validate JWT (handle expired/invalid token)
    try {
      const token = req.cookies.accessToken;
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      res.clearCookie("accessToken", { path: "/" });
      return res.redirect("/sign-in");
    }

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.max(Math.ceil(totalBooks / limit), 1);

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    let booksWithReviews = [];

    if (books.length > 0) {
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

      const reviewStatsMap = reviewStats.reduce((acc, stat) => {
        acc[stat._id.toString()] = {
          reviewCount: stat.reviewCount,
          averageRating: stat.averageRating
            ? parseFloat(stat.averageRating.toFixed(1))
            : 0,
        };
        return acc;
      }, {});

      booksWithReviews = books.map((book) => {
        const stats = reviewStatsMap[book._id.toString()] || {
          reviewCount: 0,
          averageRating: 0,
        };

        const publishedDate =
          book.publishedDate instanceof Date
            ? book.publishedDate
            : new Date(book.publishedDate);

        return {
          ...book,
          publishedLabel: !Number.isNaN(publishedDate.getTime())
            ? publishedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Unknown",
          averageRating: stats.averageRating,
          reviewCount: stats.reviewCount,
        };
      });
    }

    const popularAuthorsRaw = await Book.aggregate([
      {
        $match: {
          author: { $exists: true, $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$author",
          bookCount: { $sum: 1 },
        },
      },
      {
        $sort: { bookCount: -1, _id: 1 },
      },
      {
        $limit: 8,
      },
    ]);

    const popularAuthors = popularAuthorsRaw.map((author) => ({
      name: author._id,
      bookCount: author.bookCount,
    }));

    return res.render("index", {
      books: booksWithReviews,
      pagination: {
        page,
        limit,
        total: totalBooks,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
      popularAuthors,
    });
  } catch (error) {
    next(error);
  }
});

// Render sign-in and sign-up pages
app.get("/sign-in", (req, res) => {
  res.render("sign-in");
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// Sign-out: clear auth, destroy session, redirect to sign-in
app.get("/sign-out", (req, res, next) => {
  const finish = () => {
    res.clearCookie("accessToken", { path: "/" });
    // clear express-session cookie if present
    res.clearCookie("connect.sid", { path: "/" });
    return res.redirect("/sign-in");
  };
  try {
    if (typeof req.logout === "function") {
      // Passport 0.6+ requires a callback
      return req.logout((err) => {
        if (err) return next(err);
        if (req.session) {
          return req.session.destroy(() => finish());
        }
        return finish();
      });
    }
    if (req.session) {
      return req.session.destroy(() => finish());
    }
    return finish();
  } catch (e) {
    return finish();
  }
});

// Profile Page (protected)
app.get("/profile", verifyJWT, (req, res) => {
  // `verifyJWT` populates req.user and req.profile
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const pathOnly = req.originalUrl.split("?")[0] || "/profile";
  const canonicalUrl = `${baseUrl}${pathOnly}`;
  res.render("profile", {
    user: req.user,
    profile: req.profile,
    pageTitle: "Your Profile • Book Library",
    pageDescription:
      "View and manage your Book Library profile, preferences, and reading activity.",
    canonicalUrl,
  });
});

// Favorites Page (protected)
app.get("/favorite-books", verifyJWT, async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = 12;
    const skip = (page - 1) * limit;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const pathOnly = req.originalUrl.split("?")[0] || "/favorite-books";
    const canonicalUrl = `${baseUrl}${pathOnly}`;

    const [total, favorites] = await Promise.all([
      Favorite.countDocuments({ userId: req.profile._id }),
      Favorite.find({ userId: req.profile._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("bookId")
        .lean(),
    ]);

    const books = (favorites || [])
      .map((fav) => fav.bookId)
      .filter(Boolean)
      .map((book) => {
        const publishedDate =
          book.publishedDate instanceof Date
            ? book.publishedDate
            : new Date(book.publishedDate);
        return {
          ...book,
          publishedLabel: !Number.isNaN(publishedDate.getTime())
            ? publishedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Unknown",
        };
      });

    res.render("favorites", {
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        nextPage: page * limit < total ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
      user: req.user,
      pageTitle: "Your Favorite Books • Book Library",
      pageDescription:
        "Browse and manage your list of favorite books in Book Library.",
      canonicalUrl,
    });
  } catch (error) {
    next(error);
  }
});

// Alias route for Favorite Books page
app.get("/favorite-books", verifyJWT, (req, res) => {
  const { page } = req.query || {};
  const qs = page ? `?page=${encodeURIComponent(page)}` : "";
  return res.redirect(`/favorites${qs}`);
});

// Book Details Page (protected)
app.get("/book/:bookId", verifyJWT, async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).lean();
    if (!book) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const pathOnly = req.originalUrl.split("?")[0] || `/book/${bookId}`;
      const canonicalUrl = `${baseUrl}${pathOnly}`;
      return res.status(404).render("book-details", {
        book: null,
        reviews: [],
        reviewStats: null,
        pageTitle: "Book Not Found • Book Library",
        pageDescription:
          "The requested book could not be found in Book Library.",
        canonicalUrl,
        activePage: "home",
        user: req.user,
        isFavorite: false,
      });
    }

    // Review stats and list
    const reviewStatsAgg = await Review.aggregate([
      { $match: { bookId: book._id } },
      {
        $group: {
          _id: "$bookId",
          reviewCount: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    const reviewStats = reviewStatsAgg[0]
      ? {
          reviewCount: reviewStatsAgg[0].reviewCount,
          averageRating: reviewStatsAgg[0].averageRating
            ? parseFloat(reviewStatsAgg[0].averageRating.toFixed(1))
            : 0,
        }
      : { reviewCount: 0, averageRating: 0 };

    const publishedDate =
      book.publishedDate instanceof Date
        ? book.publishedDate
        : new Date(book.publishedDate);

    const viewBook = {
      ...book,
      publishedLabel: !Number.isNaN(publishedDate.getTime())
        ? publishedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Unknown",
    };

    const reviews = await Review.find({ bookId })
      .sort({ createdAt: -1 })
      .lean();

    const favored = await Favorite.findOne({
      bookId,
      userId: req.profile._id,
    }).lean();

    // SEO meta
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const pathOnly = req.originalUrl.split("?")[0] || `/book/${bookId}`;
    const canonicalUrl = `${baseUrl}${pathOnly}`;
    const pageTitle = `${viewBook.title} • Book Library`;
    const pageDescription =
      viewBook.description?.slice(0, 160) ||
      `Read more about "${viewBook.title}" by ${viewBook.author}.`;

    return res.render("book-details", {
      book: viewBook,
      reviewStats,
      reviews,
      user: req.user,
      isFavorite: !!favored,
      activePage: "home",
      pageTitle,
      pageDescription,
      canonicalUrl,
    });
  } catch (error) {
    next(error);
  }
});

// * API DOCS
// ? Keeping swagger code at the end so that we can load swagger on "/" route
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none", // keep all the sections collapsed by default
    },
    customSiteTitle: "Book Library API Documentation",
    // customCss: ".swagger-ui .topbar { display: none }", // hide the top bar
  })
);

app.use(errorHandler);

export { httpServer };
