const express = require("express");
const router = express.Router();
const { validLogin } = require("../helpers/jwtHelpers");
const Package = require("../db/Models/Package");

router.post("/", async(req, res) => {
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
module.exports = router;