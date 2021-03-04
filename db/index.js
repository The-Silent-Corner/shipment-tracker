const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

function determineStorageLoc() {
  if(!path.resolve("database.sqlite3")) {
    fs.writeFile("database.sqlite3");
  }
  if(!path.resolve("test_db.sqlite3")) {
    fs.writeFile("test_db.sqlite3");
  }
  if(process.env.NODE_ENV === "test") {
    return {
      storage: path.resolve("test_db.sqlite3"),
      logging: false
    };
  }
  return {
    storage: path.resolve("database.sqlite3"),
    logging: console.log
  };
}

const dbInstance = new Sequelize(({
  dialect: "sqlite",
  ...determineStorageLoc()
}));

module.exports = dbInstance;