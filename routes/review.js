const express = require("express");
const router = express.Router({ mergeParams: true }); // Needed to access :id from parent route
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

/**
 * CREATE REVIEW
 * POST /listings/:id/reviews
 */
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

/**
 * DELETE REVIEW
 * POST /listings/:id/reviews/:reviewId/delete
 */
router.post(
  "/:reviewId/delete",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
