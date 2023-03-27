const express = require("express");
const app = express();
const { getCategories } = require("./controllers/category-controller");

app.get("/api/categories", getCategories);

app.use("*", (req, res, next) => {
  next({ status: 404, msg: "Data not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err);
  } else {
    res.status(500).send("Internal server error");
  }
});

module.exports = app;
