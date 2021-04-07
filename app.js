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

app.use("/login", require("./routes/login.js"));

app.use("/", require("./routes/home.js"));

app.use("/logout", require("./routes/logout.js"));

app.use("/track", require("./routes/track.js"));

app.use("/edit-package", require("./routes/editPackage.js"));

app.use("/add", require("./routes/add.js"));
module.exports = app;