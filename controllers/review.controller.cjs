const reviewModel = require("../models/review.schema.cjs");

// GET All Reviews
exports.getAllReviews = async (req, res) => {
  try {
    let filter = {};
    if (req.query.bookId) {
      filter.book = req.query.bookId;
    }

    const reviews = await reviewModel.find(filter).populate("user", "username");
    return res.status(200).json({
      message: "Reviews fetched successfully",
      results: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.log("Error fetching reviews:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET Review By Id
exports.getReviewById = async (req, res) => {
  try {
    const review = await reviewModel
      .findById(req.params.id)
      .populate("user", "username")
      .populate("book", "title");

    if (!review) {
      return res.status(404).json({ message: "Review not found!" });
    }

    return res.status(200).json({
      message: "Review retrieved successfully",
      data: review,
    });
  } catch (error) {
    console.log("Error getting review by ID:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid review ID format" });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

// Create new Review
exports.createReview = async (req, res) => {
  try {
    const { book, rating, comment } = req.body;

    const user = req.user._id;
    const review = await reviewModel.create({
      book,
      user,
      rating,
      comment,
    });
    return res.status(201).json({
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    console.log("Error creating review:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "You have already reviewed this book! You can only review a book once.",
      });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found!" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access Denied! You can only edit your own reviews.",
      });
    }
    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    return res.status(200).json({
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.log("Error updating review:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid review ID format" });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found!" });
    }
    await reviewModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log("Error deleting review:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid review ID format" });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};
