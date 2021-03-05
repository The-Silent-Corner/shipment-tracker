const { DataTypes } = require("sequelize");
const db = require("../");

const User = db.define("User", {
  id:{
    primaryKey : true,
    type: DataTypes.STRING,
    allowNull: false
  },
  password:{
    type:DataTypes.STRING,
    allowNULL: false
  }
});

module.exports = User;