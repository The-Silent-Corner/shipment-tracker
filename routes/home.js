const express = require("express");
const router = express.Router();
const { validLogin } = require("../helpers/jwtHelpers");

router.get("/", async(req, res) => {
  if(req.signedCookies.user) {
    const valid = await validLogin(req, res);
    if(!valid) {
      return;
    }
    return res.render("employeeHome", { message: req.flash("message") });
  }
  res.render("index");
});

module.exports = router;