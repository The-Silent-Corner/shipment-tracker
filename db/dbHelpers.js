const db = require("./index");
const Models = require("../db/Models");

async function createTables() {
  await db.authenticate();
  await Models.Package.sync();
}

module.exports = createTables;

module.exports.wipeDbTables = async function() {
  await db.drop();
  await createTables();
};