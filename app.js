const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const Employee = require("./db/Models/Employee");
const cookieParser = require("cookie-parser");

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
    return res.render("employeeHome");
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

app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/login");
});

module.exports = app;
