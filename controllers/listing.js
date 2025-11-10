const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClent = mbxGeocoding({ accessToken: mapToken });

module.exports.showSearchedListings = async (req, res) => {
  let query = req.query.destination;
  const allListing = await Listing.find({ location: query });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash(
      "error",
      "WE ARE SOORY !. We are not providing Hotels in Your Location . Please try near by Locations!"
    );
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here we are !");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.showTrendingListings = async (req, res) => {
  const allListing = await Listing.find({ category: "trending" });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash("error", "WE ARE SOORY !. We dont have any trending listings");
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here the trending Listings are");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.showRoomListings = async (req, res) => {
  const allListing = await Listing.find({ category: "rooms" });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash("error", "WE ARE SOORY !. We dont have any rooms listings");
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here the trending Listings are");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.showIconicCitiesListings = async (req, res) => {
  const allListing = await Listing.find({ category: "iconicCities" });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash("error", "WE ARE SOORY !. We dont have any trending listings");
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here the trending Listings are");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.showMountainsListings = async (req, res) => {
  const allListing = await Listing.find({ category: "mountains" });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash("error", "WE ARE SOORY !. We dont have any mountain listings");
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here the mountain Listings are");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.showDomeListings = async (req, res) => {
  const allListing = await Listing.find({ category: "domes" });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash("error", "WE ARE SOORY !. We dont have any domes listings");
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here the domes Listings are");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.showBoatListings = async (req, res) => {
  const allListing = await Listing.find({ category: "boats" });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash("error", "WE ARE SOORY !. We dont have any boat listings");
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here the boat Listings are");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.showAmazingPoolsListings = async (req, res) => {
  const allListing = await Listing.find({ category: "amazingPools" });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash(
      "error",
      "WE ARE SOORY !. We dont have any amazingPools listings"
    );
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here the amazingPools Listings are");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.showTArcticListings = async (req, res) => {
  const allListing = await Listing.find({ category: "arctic" });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash("error", "WE ARE SOORY !. We dont have any arctic listings");
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here the arctic Listings are");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.showFarmsListings = async (req, res) => {
  const allListing = await Listing.find({ category: "farms" });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash("error", "WE ARE SOORY !. We dont have any farms listings");
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here the farms Listings are");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.showCampingListings = async (req, res) => {
  const allListing = await Listing.find({ category: "camping" });
  // console.log(allListing);
  if (allListing.length === 0) {
    req.flash("error", "WE ARE SOORY !. We dont have any camping listings");
    return res.redirect("/listings");
  } else {
    req.flash("success", "Here the camping Listings are :");
    res.render("./listings/searchdShow.ejs", { allListing });
  }
};
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("./listings/new.ejs");
};
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClent
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  // console.log(response.body.features[0].geometry);
  // res.send("done!");

  let filename = req.file.filename;
  let url = req.file.path;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};
module.exports.showListings = async (req, res) => {
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
};
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you are requesting does not exist !");
    return res.redirect("/listings");
  }
  // console.log(listing.image.url);
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  // console.log(originalImageUrl)
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let filename = req.file.filename;
    let url = req.file.path;
    listing.image = { url, filename };
  }
  await listing.save();
  req.flash("success", "Your Listing was updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleated");

  res.redirect("/listings");
};
