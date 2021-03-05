const router = require("express").Router();
const Package = require("../db/Models/Package");
const { v4: uuid } = require("uuid");

router.post("/add", async(req, res) => {
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
  res.json({
    Package: results
  });
});

router.post("/update", async(req, res) =>{
  const{ id, status, shippedDate, deliveryDate } = req.body;
  if(!status || !shippedDate || !deliveryDate) {
    return res.sendStatus(400);
  }
  try
  {
    await Package.update(
      {
        status: status,
        shippedDate: shippedDate,
        deliveryDate: deliveryDate
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
  res.sendStatus(200);
});

module.exports = router;
