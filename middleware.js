
const passport = require("passport");
const Listing = require("./models/listing");

const ExpressErr = require("./utils/expressErr.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // storing present url because user is not logged
    //  in to aome back again after login we need to save present URL

    req.session.redirectUrl = req.originalUrl;
    // console.log(req.session.redirectUrl);

    req.flash("error", "LOGIN  .. To continue Bookify ");
    return res.redirect("/login");
  }
  next();
};
// module.exports.isLoggedIntoDeleteReviews = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     // storing present url because user is not logged
//     //  in to come back again after login we need to save present URL
//     let id = req.params;
//     req.session.redirectUrl =`/listings/${id}/reviews`;
//     // console.log(req.session.redirectUrl);

//     req.flash("error", "LOGIN  .. To continue WonderLust ");
//     return res.redirect("/login");
//   }
//   next();
// };

module.exports.saveRedirectUrl = (req, res, next) => {
  // console.log(req.session.redirectUrl);
  if (req.session.redirectUrl) {
    // storing present url in locals bcz passport doesnt have access to modify locals
    res.locals.redirectUrl = req.session.redirectUrl;
    // console.log(res.locals.redirectUrl)
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Owner of this Listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressErr(400, errMsg);
  } else {
    next();
  }
};
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressErr(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "This Review is NOT Your's");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
