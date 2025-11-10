const express = require("express");
const router = express.Router();
// const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressErr = require("../utils/expressErr.js");
const { validateReview } = require("../middleware.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const { postReview } = require("../controllers/reviews.js");

// review route
// post route
router.post(
  "/:id/reviews",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview)
);

// delete review route

router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);
module.exports = router;
