const Package = require("../db/Models/Package");
const { v4: uuidv4 } = require("uuid");

(async() => {
  for(let i = 0; i < 50; i++) {
    await Package.create({
      id: uuidv4(),
      status: `status ${i}`,
      shippedDate: `Shipped Date ${i}`,
      deliveryDate: `Delivered ${i}`,
      customerEmail: "foobar@gmail.com",
      toAddress: "dummy address",
      fromAddress: "dummy from address"
    });
  }
})();
