require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const Employee = require("./db/Models/Employee");
const cookieParser = require("cookie-parser");
const Package = require("./db/Models/Package");
const jwt = require("jsonwebtoken");
const { validLogin } = require("./helpers/jwtHelpers");
const session = require("express-session");
const flash = require("connect-flash");

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(process.env.SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET
}));
app.use(flash());

app.use("/api", require("./api"));

app.get("/", async(req, res) => {
  if(req.signedCookies.user) {
    const valid = await validLogin(req, res);
    if(!valid) {
      return;
    }
    return res.render("employeeHome", { message: req.flash("message") });
  }
  res.render("index");
});

app.get("/login", async(req, res) =>{
  if(req.signedCookies.user) {
    return res.redirect("/");
  }
  res.render("login");
});

app.post("/login", async(req, res) =>{
  const { username, password } = req.body;
  try {
    const findEmployee = await Employee.findAll({
      where: {
        id: username
      }
    });
    if(findEmployee.length !== 1) {
      return res.sendStatus(401);
    }
    if(password === findEmployee[0].password) {
      const token = jwt.sign({ user: findEmployee[0].id }, process.env.SECRET, {
        expiresIn: "1h"
      });
      res.cookie("user", token, {
        httpOnly: true,
        signed: true,
        maxAge: 1e3 * 3600 // expires in an hour
      });
      return res.redirect("/");
    } else {
      return res.sendStatus(401);
    }
  } catch(error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/logout", async(req, res) => {
  res.clearCookie("user");
  res.redirect("/login");
});

app.get("/track", async(req, res) =>{
  res.render("track");
});

app.post("/track", async(req, res) =>{
  const userEmail = req.body.email;
  const findEmail = await Package.findAll({
    where: {
      customerEmail: userEmail
    }
  });
  if(findEmail.length > 0) {
    console.log(findEmail);
    console.log(`The length is ${findEmail.length}`);
    return res.render("packageInfo", { Package: findEmail });
  }
  return res.sendStatus(500);
});

app.post("/edit-package", async(req, res) => {
  const valid = await validLogin(req, res);
  if(!valid) {
    return;
  }
  let { id } = req.query;
  if(!id) {
    id = req.body.id;
  }
  try {
    const data = await Package.findOne({
      where: {
        id: id
      }
    });
    if(!data) {
      req.flash("message", {
        classes: ["is-warning", "is-light"],
        text: "Package not found"
      });
      return res.redirect("/");
    }
    res.render("editPackage", { data: data });
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
});
module.exports = app;