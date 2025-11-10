if (process.env.NODE_ENV !== "production") require("dotenv").config();

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
const User = require("./models/user.js");
const Listing = require("./models/listing");
const Booking = require("./models/booking");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const bookingRoutes = require("./routes/booking");

// Razorpay
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// EJS + Middleware
app.set("view engine", "ejs");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOPns = {
  secret: "mySecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: { expires: Date.now() + 7*24*60*60*1000, maxAge: 7*24*60*60*1000, httpOnly: true },
};
app.use(session(sessionOPns));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + current user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// MongoDB
const dbUrl=process.env.ATLASDB_URL
mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Routes
app.get("/", (req, res) => res.send("Connection successful"));
app.use("/listings", listingRoutes);
app.use("/listings", reviewRoutes);
app.use("/", userRoutes);
app.use("/listings/:id", bookingRoutes);

// Razorpay Payment
app.get("/payment/:bookingId", async (req, res) => {
  const bookingId = req.params.bookingId;
  try {
    const booking = await Booking.findById(bookingId).populate("listing");
    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/");
    }
    const totalAmount = req.query.amount || booking.totalAmount;
    res.render("payment", {
      listing: booking.listing,
      totalAmount,
      bookingId,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/");
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));




// ==============================
// Required Packages & Setup
// ==============================
// const express = require("express");
// const app = express();
// const port = 8080;
// const path = require("path");
// const methodOverride = require("method-override");
// const mongoose = require("mongoose");
// const ejsMate = require("ejs-mate");
// const dotenv = require("dotenv");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const { listingSchema, reviewSchema } = require("./schema.js");
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressErr = require("./utils/expressErr.js");

// dotenv.config();

// // ==============================
// // Express Configurations
// // ==============================
// app.set("view engine", "ejs");
// app.engine("ejs", ejsMate);
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));

// // ==============================
// // Database Connection
// // ==============================
// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
//   console.log("✅ MongoDB Connected Successfully");
// }
// main().catch((err) => console.log(err));

// // ==============================
// // Routes
// // ==============================
// const listings = require("./routes/listing.js");
// const reviews = require("./routes/review.js");

// app.use("/listings", listings);
// app.use("/listings", reviews);

// app.get("/", (req, res) => {
//   res.send("✅ Connection Successful! App is running.");
// });

// // ==============================
// // Booking Route (Stripe Integration)
// // ==============================
// app.post("/listings/:id/book", async (req, res) => {
//   const { id } = req.params;
//   const { startDate, endDate, name, email } = req.body;

//   const listing = await Listing.findById(id);
//   if (!listing) throw new ExpressErr(404, "Listing not found!");

//   // Calculate fake price for demo (you can change it)
//   const totalAmount = listing.price * 100; // convert to paise

//   // Create Stripe Checkout Session
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: [
//       {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: listing.title,
//             description: `Booking from ${startDate} to ${endDate}`,
//           },
//           unit_amount: totalAmount,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `http://localhost:${port}/success`,
//     cancel_url: `http://localhost:${port}/cancel`,
//     customer_email: email,
//   });

//   res.redirect(session.url);
// });

// // ==============================
// // Success & Cancel Routes
// // ==============================
// app.get("/success", (req, res) => {
//   res.render("paymentSuccess.ejs");
// });

// app.get("/cancel", (req, res) => {
//   res.render("paymentCancel.ejs");
// });

// // ==============================
// // Error Handler
// // ==============================
// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).render("error.ejs", { err });
// });

// // ==============================
// // Start Server
// // ==============================
// app.listen(port, () => {
//   console.log(`🚀 Server running on http://localhost:${port}`);
// });
