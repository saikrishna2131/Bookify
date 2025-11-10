const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync.js");

// const ExpressErr = require("../utils/expressErr.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// const isOwner = require("../middleware.js");
const listingController = require("../controllers/listing.js");
router.use(methodOverride("_method"));
// Rendering form to create new Listing
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));
// search Route
router.get("/trending", listingController.showTrendingListings);
router.get("/rooms", listingController.showRoomListings);
router.get("/IconicCities", listingController.showIconicCitiesListings);
router.get("/mountains", listingController.showMountainsListings);
router.get("/domes", listingController.showDomeListings);
router.get("/boats", listingController.showBoatListings);
router.get("/amazingPools", listingController.showAmazingPoolsListings);
router.get("/arctic", listingController.showTArcticListings);
router.get("/farms", listingController.showFarmsListings);
router.get("/camping", listingController.showCampingListings);

router.get("/search", listingController.showSearchedListings);
router
  .route("/")
  //index route
  .get(wrapAsync(listingController.index))
  //create route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//new route
router
  .route("/:id")
  // show Listings
  .get(wrapAsync(listingController.showListings))
  // Update Listing
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  // delete Listing Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//show route
// router.get("/:id", wrapAsync(listingController.showListings));

//update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );
//delete route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.deleteListing)
// );

module.exports = router;
// const listing = await Listing.findById(id)
// .populate({
//   path: "reviews",
//   populate: {
//     path: "author",
//   },
// })
// .populate("owner");
