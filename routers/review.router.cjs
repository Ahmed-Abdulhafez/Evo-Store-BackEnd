const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller.cjs");
const authMiddlware = require("../middlewares/authMiddleware.cjs");
const { isAdmin } = require("../middlewares/isAdmin.middleware.cjs");

// API Get All Reviews
router.get("/api/reviews", reviewController.getAllReviews);

// API Create Review
router.post("/api/reviews",authMiddlware, reviewController.createReview);

// API Delete Review
router.delete(
  "/api/reviews/:id",
  authMiddlware,
  isAdmin,
  reviewController.deleteReview,
);

// API Get Review By Id
router.get("/api/reviews/:id", authMiddlware, reviewController.getReviewById);

// API Update Review By Id
router.put("/api/reviews/:id", authMiddlware, reviewController.updateReview);

module.exports = router;