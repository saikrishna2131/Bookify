const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressErr = require("../utils/expressErr.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
// const isOwner = require("../middleware.js");

router.use(methodOverride("_method"));


//index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);
//new route
router.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
  })
);
//create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);
//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    // const listing = await Listing.findById(id)
    //   .populate("reviews")
    //   .populate("owner");
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you are requesting does not exist !");
      return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing });
  })
);
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you are requesting does not exist !");
      return res.redirect("/listings");
    } else {
      res.render("./listings/edit.ejs", { listing });
    }
  })
);
//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Your Listing was updated");
    res.redirect(`/listings/${id}`);
  })
);
//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleated");

    res.redirect("/listings");
  })
);

module.exports = router;
// const listing = await Listing.findById(id)
      // .populate({
      //   path: "reviews",
      //   populate: {
      //     path: "author",
      //   },
      // })
      // .populate("owner");