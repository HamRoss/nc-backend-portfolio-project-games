const {
  fetchReview,
  fetchReviews,
  insertReviewComment,
  fetchReviewComments,
  checkReviewIdExists,
  updateVotes,
  checkCategoryExists,
} = require("../models/review-model.js");

function getReview(req, res, next) {
  const { review_id } = req.params;
  fetchReview(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
}

function getReviewComments(req, res, next) {
  const { review_id } = req.params;
  fetchReviewComments(review_id)
    .then((comments) => {
      if (comments.length === 0) {
        return checkReviewIdExists(review_id);
      }
      res.status(200).send({ comments });
    })
    .then(() => {
      res.status(200).send({ comments: [] });
    })
    .catch((err) => {
      next(err);
    });
}

function getReviews(req, res, next) {
  const { category, sort_by, order } = req.query;
  fetchReviews(category, sort_by, order)
    .then((reviews) => {
      if (reviews.length === 0) {
        return checkCategoryExists(category);
      }

      res.status(200).send({ reviews });
    })
    .then(() => {
      res.status(200).send({ reviews: [] });
    })
    .catch((err) => {
      next(err);
    });
}

function postReviewComment(req, res, next) {
  const { review_id } = req.params;
  const { username, body } = req.body;
  insertReviewComment(username, body, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

function patchVotes(req, res, next) {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateVotes(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getReview,
  getReviews,
  postReviewComment,
  getReviewComments,
  patchVotes,
};
