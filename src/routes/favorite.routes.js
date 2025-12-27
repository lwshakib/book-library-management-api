import express from "express";
import {
  deleteFavorite,
  getMyFavorites,
  makeItMyFavorite,
} from "../controllers/favorite.controllers.js";

export const favoriteRouter = express.Router();

favoriteRouter.post("/:bookId", makeItMyFavorite);
favoriteRouter.get("/", getMyFavorites);
favoriteRouter.delete("/:bookId", deleteFavorite);
