const express = require("express");
const cors = require("cors");
const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", require("./api"));

app.get("/", async(req, res) => {
  res.json({
    message: "Please specify api path"
  });
});

module.exports = app;
