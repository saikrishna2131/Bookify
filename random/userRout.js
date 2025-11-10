const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { equal } = require("joi");
const User = require("../models/user.js");
const router = express.Router();
const saveRedirectUrl = require("../middleware.js");
const passport = require("passport");
//register new User

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

//completing registreation of user

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let savedUser = await User.register(newUser, password);
      //   direct LOGIN after signUp
      req.login(savedUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Bookify !!");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

// Login User

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// checking about details submited by user are correct or not

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to Bookify");
    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
  }
);
// loggout

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out Now !");
    res.redirect("/listings");
  });
});
module.exports = router;
