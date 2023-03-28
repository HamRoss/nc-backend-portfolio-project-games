const { fetchReview, fetchReviews } = require("../models/review-model.js");

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

function getReviews(req, res, next) {
  fetchReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
}

module.exports = { getReview, getReviews };
