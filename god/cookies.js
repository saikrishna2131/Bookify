const express = require("express");
const app = express();
const port = 3000;
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "mysecretcode",
  resave: false,
  saveUninitialized: true,
};

app.use(cookieParser("secretcode"));
app.use(session(sessionOptions));

app.use(flash());
app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  // console.log(req.session.name);
  req.flash("success", "you registred succesfully");
  res.redirect("/hello");
});
app.get("/hello", (req, res) => {
  // console.log(req.session.name);
  res.render("index.ejs", {
    name: req.session.name,
    msg: req.flash("success"),
  });
});
//  msg: req.flash("success"),
// res.send(`hello ${req.session.name}`);
// });

// app.get("/count", (req, res) => {
//   if(req.session.count)
//   {
//     req.session.count++;
//   }
//   else{
//     req.session.count=1;
//   }

//   res.send(`you requested ${req.session.count} times`);
// });

// app.get("/cookiesGen", (req, res) => {
//   res.cookie("greet", "hello", { signed: true });
//   res.cookie("name", "krishna", { signed: true });
//   res.send("good bro");
// });
// app.get("/cookies", (req, res) => {
//   console.log(req.signedCookies);
//   res.send("cookies are :");
// });
// app.get("/name", (req, res) => {
//   let { name = "krishna" } = req.cookies;
//   res.send(`hlo ${name}`);
// });

app.listen(port, () => {
  console.log(`listining to port ${port}`);
});
