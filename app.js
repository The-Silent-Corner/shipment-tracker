require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const Employee = require("./db/Models/Employee");
const cookieParser = require("cookie-parser");
const Package = require("./db/Models/Package");

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/api", require("./api"));

app.get("/", async(req, res) => {
  if(req.cookies.user) {
    return res.render("employeeHome");
  }
  res.render("index");
});

app.get("/login", async(req, res) =>{
  if(req.cookies.user) {
    // Redirect if already logged in
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
    if(findEmployee.length !== 1)
      return res.sendStatus(401);
    if(password === findEmployee[0].password) {
      res.cookie("user", {
        user: findEmployee[0].id
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
  let { id } = req.query;
  if(!id) {
    id = req.body.id;
  }
  const data = await Package.findOne({
    where: {
      id: id
    }
  });
  res.render("editPackage", { data: data });
});
module.exports = app;