const express = require("express");
const router = express.Router();

router.get("/", async(req, res) => {
  res.clearCookie("user");
  res.redirect("/login");
});
module.exports = router;