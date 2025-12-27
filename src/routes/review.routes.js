import express from 'express';
import { giveAReview, getReviewsByBook, updateReview, deleteReview } from '../controllers/review.controllers.js';

export const reviewRouter = express.Router();

reviewRouter.post('/:bookId', giveAReview);
reviewRouter.get('/:bookId', getReviewsByBook);
reviewRouter.delete('/:reviewId', deleteReview);
reviewRouter.put('/:reviewId', updateReview);