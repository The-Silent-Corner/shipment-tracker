const supertest = require("supertest");
const app = require("../app");
const Models = require("../db/Models");
const request = supertest(app);
const { wipeDbTables } = require("../db/dbHelpers");

describe("The API Router", function () {
  beforeEach(async() => {
    await wipeDbTables();
  });
  describe("/api/add", () => {
    it("should post the data", async function () {
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

    it("should fetch list", async function () {
      const response = await request.get("/api/all");
    });
  });
});

