import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { authRouter } from "./auth.routes.js";
import { bookRouter } from "./book.routes.js";
import { favoriteRouter } from "./favorite.routes.js";
import { reviewRouter } from "./review.routes.js";

export const routes = express.Router();

routes.use("/auth", authRouter);
routes.use("/books", verifyJWT, bookRouter);
routes.use("/reviews", verifyJWT, reviewRouter);
routes.use("/favorites", verifyJWT, favoriteRouter);
