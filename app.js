const express = require("express");
const app = express();
const { getCategories } = require("./controllers/category-controller");
const {
  getReview,
  getReviews,
  postReviewComment,
  getReviewComments,
  patchVotes,
} = require("./controllers/review-controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handle500Errors,
} = require("./errors/error-handling-functions");
const { getUsers } = require("./controllers/user-controller");

const { deleteComment } = require("./controllers/comment-controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReview);

app.patch("/api/reviews/:review_id", patchVotes);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.post("/api/reviews/:review_id/comments", postReviewComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use("*", (req, res, next) => {
  next({ status: 404, msg: "Data not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;
