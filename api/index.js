const router = require("express").Router();
const Package = require("../db/Models/Package");
const { v4: uuid } = require("uuid");
const { validLogin } = require("../helpers/jwtHelpers");

router.post("/add", async(req, res) => {
  const valid = validLogin(req, res);
  if(!valid) {
    return;
  }
  const { customerEmail, toAddress, fromAddress } = req.body;
  if(!customerEmail || !toAddress || !fromAddress) {
    return res.sendStatus(400);
  }
  try
  {
    await Package.create({
      id: uuid(),
      status: "PENDING",
      customerEmail: customerEmail,
      toAddress: toAddress,
      fromAddress: fromAddress
    });
  }
  catch(err) {
    console.error(err);
    return res.sendStatus(500);
  }
  res.sendStatus(200);
});

router.get("/all", async(req, res) => {
  const results = await Package.findAll();
  res.render("viewPackages", { Package: results });
});

router.post("/update", async(req, res) =>{
  const valid = await validLogin(req, res);
  if(!valid) {
    return;
  }
  const { status } = req.body;
  const { id } = req.query;
  if(!status || !id) {
    return res.sendStatus(400);
  }
  try
  {
    await Package.update(
      {
        status: status
      },
      {
        where: {
          id: id
        }
      }
    );
  } catch(error) {
    console.error(error);
    return res.sendStatus(500);
  }
  res.redirect("/api/all");
});

module.exports = router;
