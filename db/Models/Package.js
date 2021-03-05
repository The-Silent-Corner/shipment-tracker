const { DataTypes } = require("sequelize");
const dbInstance = require("../");

/*
A website in which you can track information about a package.
+ (ID of package)
+ (Shipped) dated
+ (Assumed) delivery date
+ Employees can track packages as well as customers
  + Update package status
+ Customers can track packages
  1. Track by providing a package number (bring up a package)
  2. Track by providing email (brings up a list of associated packages)
*/

const Package = dbInstance.define("Packages", {
  id:{
    primaryKey: true,
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippedDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deliveryDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  toAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fromAddress: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Package;
