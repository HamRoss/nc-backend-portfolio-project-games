const express = require("express");
const app = express();
const { getCategories } = require("./controllers/category-controller");
const {
  getReview,
  getReviews,
  postReviewComment,
  getReviewComments,
} = require("./controllers/review-controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handle500Errors,
} = require("./errors/error-handling-functions");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews/:review_id/comments", getReviewComments);
app.get("/api/reviews", getReviews);

app.post("/api/reviews/:review_id/comments", postReviewComment);

app.use("*", (req, res, next) => {
  next({ status: 404, msg: "Data not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;
