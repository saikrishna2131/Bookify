const express = require("express");
const router = express.Router({ mergeParams: true });
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// Show booking form
router.get("/book", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/book", { listing });
});

// Create booking and redirect to payment page
router.post("/book", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const { startDate, endDate, guests, name, email, phone } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalAmount = nights * listing.price;

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    startDate: start,
    endDate: end,
    nights,
    totalAmount,
    email,
    phone,
  });

  await booking.save();
  req.flash("success", "Booking created! Proceed to payment.");
  res.redirect(`/payment/${booking._id}?amount=${totalAmount}`);
});

module.exports = router;
