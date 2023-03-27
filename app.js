const express = require("express");
const app = express();
const { getCategories } = require("./controllers/category-controller");
const { getReview } = require("./controllers/review-controller");

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.use("*", (req, res, next) => {
  next({ status: 404, msg: "Data not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
