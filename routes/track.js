const express = require('express');
const router = express.Router();
const Package = require("../db/Models/Package");

router.get("/", async(req, res) =>{
    res.render("track");
});
router.post("/", async(req, res) =>{
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
  module.exports = router;