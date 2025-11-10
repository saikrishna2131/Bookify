const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postReview = async (req, res) => {
  const newListing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  newListing.reviews.push(newReview);
  newReview.author = req.user._id;
  await newReview.save();
  // newListing.reviews.push(newReview._id);
  await newListing.save();
  req.flash("success", "Review Created");

  res.redirect(`/listings/${newListing.id}`);
};
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleated");

  res.redirect(`/listings/${id}`);
};
