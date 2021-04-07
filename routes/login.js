const express = require('express');
const router = express.Router();
const Employee = require("../db/Models/Employee");
const jwt = require("jsonwebtoken");
router.post("/", async(req, res) =>{
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
router.get("/", async(req, res) =>{
  if(req.signedCookies.user) {
    return res.redirect("/");
  }
  res.render("login", { message: req.flash("message") });
});
  module.exports = router;