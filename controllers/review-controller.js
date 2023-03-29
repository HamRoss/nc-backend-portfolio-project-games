const {
  fetchReview,
  fetchReviews,
  insertReviewComment,

  fetchReviewComments,
  checkReviewIdExists,
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
      console.log(comments);

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
  fetchReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
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
      console.log(err);
      next(err);
    });
}

module.exports = { getReview, getReviews, postReviewComment, getReviewComments };
