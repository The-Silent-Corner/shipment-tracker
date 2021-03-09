const supertest = require("supertest");
const app = require("../app");
const Models = require("../db/Models");
const request = supertest(app);
const { wipeDbTables } = require("../db/dbHelpers");

describe("The API Router", function() {
  beforeEach(async() => {
    await wipeDbTables();
  });
  describe("/api/add", () => {
    it("should post the data", async function() {
      const response = await request
        .post("/api/add")
        .set("Accept", "application/json")
        .send({
          customerEmail: "foobar@gmail.com",
          toAddress: "testAddress@gmail.com",
          fromAddress: "testAddress@gmail.com"
        });
      expect(response.status).toEqual(200);
      expect((await Models.Package.findAll()).length).toEqual((1));
    });

    it("should fetch list", async function() {
      const response = await request.get("/api/all");
      expect(response.status).toEqual(200);
    });

    describe("when the server fails", function() {
      it("should fail to post data", async function() {
        
      });
    });

    describe("missing a request parameter", function() {
      it("should send back a 400", async function() {
        const response = await request.post("/api/add")
          .set("accept", "application/json")
          .send({
            customerEmail: "hello",
            toAddress: "goodbye"
          });
        expect(response.status).toEqual(400);
      });
    });
  });

  describe("/api/update", function() {
    const beforePackageDetails = {
      id: "123",
      status: "status",
      shippedDate: "shippedDate00",
      deliveryDate: "deliveryDate00",
      customerEmail: "foobar@gmail.com",
      toAddress: "123 st",
      fromAddress: "321 rd"
    };

    beforeEach(async() => {
      await Models.Package.create(beforePackageDetails);
    });

    it("should be updated", async function() {
      let f = await Models.Package.findAll();
      const response = await request.post("/api/update")
        .set("Accept", "application/json")
        .send({
          id: "123",
          status: "new status",
          shippedDate: "new shipped date",
          deliveryDate: "new delivery date"
        });
      expect(response.status).toEqual(200);
      f = await Models.Package.findAll();
      const { status, shippedDate, deliveryDate } = f[0];
      expect(status).toEqual("new status");
      expect(shippedDate).toEqual("new shipped date");
      expect(deliveryDate).toEqual("new delivery date");
    });

    describe("missing a request parameter", function() {
      it("should send back a 400", async function() {
        const response = await request.post("/api/update")
          .set("accept", "application/json")
          .send({
            id: "123",
            shippedDate: "HELLO",
            deliveryDate: "goodbye"
          });
        expect(response.status).toEqual(400);
      });
    });

  });
});

describe("No api prefix", function() {
  it("should send a 200 status", async function() {
    const response = await request.get("/");
    expect(response.status).toEqual(200);
  });
});