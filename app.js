if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 4000;
const path = require("path");
const session = require("express-session");
const flash = require("express-flash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Listing = require("./models/listing");
const Booking = require("./models/booking");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const bookingRoutes = require("./routes/booking");

// Razorpay
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// EJS setup
app.set("view engine", "ejs");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOPns = {
  secret: "mySecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOPns));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// MongoDB connection
const dbUrl=process.env.ATLASDB_URL
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Routes
app.use("/listings", listingRoutes);
app.use("/listings", reviewRoutes);
app.use("/", userRoutes);
app.use("/listings/:id", bookingRoutes);

// Home route
app.get("/", (req, res) => res.redirect("/listings"));

// =======================
// Booking route (create booking)
// =======================

app.post("/listings/:id/book", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    const start = new Date(req.body.startDate);
    const end = new Date(req.body.endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
      req.flash("error", "End date must be after start date");
      return res.redirect("back");
    }

    const totalAmount = nights * Number(listing.price);

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      startDate: start,
      endDate: end,
      nights,
      totalAmount,
      email: req.body.email,
      phone: req.body.phone,
    });

    await booking.save();
    res.redirect(`/payment/${booking._id}?amount=${totalAmount}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
});

// =======================
// Razorpay payment page
// =======================
app.get("/payment/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate(
      "listing"
    );
    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/listings");
    }
    const totalAmount = Number(req.query.amount || booking.totalAmount);
    res.render("payment", {
      listing: booking.listing,
      totalAmount,
      bookingId: booking._id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
});

// Payment success page

app.get("/payment-success/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("listing")
      .populate("user");
    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/listings");
    }
    res.render("payment-success", { booking });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
});

// Payment cancel page
app.get("/payment-cancel", (req, res) => res.render("payment-cancel"));

// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));
