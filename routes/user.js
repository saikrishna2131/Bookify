const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { equal } = require("joi");
const User = require("../models/user.js");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
//register new User
const userController = require("../controllers/user.js");

router
  .route("/signup")
  //register new User
  .get(userController.renderSignupForm)
  //completing registreation of user
  .post(wrapAsync(userController.signup));

// router.get("/signup", userController.renderSignupForm);

//completing registreation of user

// router.post("/signup", wrapAsync(userController.signup));

// Login User

router
  .route("/login")
  // Login User
  .get(userController.renderLoginForm)
  // checking about details submited by user are correct or not
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.login
  );

// router.get("/login", userController.renderLoginForm);

// checking about details submited by user are correct or not

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureFlash: true,
//     failureRedirect: "/login",
//   }),
//   userController.login
// );
// loggout

router.get("/logout", userController.logout);
module.exports = router;
