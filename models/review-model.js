const db = require("../db/connection");

function fetchReview(id) {
  const queryString = "SELECT * FROM reviews WHERE review_id = $1;";
  const value = [id];
  return db.query(queryString, value).then((response) => {
    const review = response.rows[0];
    if (!review) {
      return Promise.reject({
        status: 404,
        msg: `No review found for review_id ${id}`,
      });
    }
    return review;
  });
}

function fetchReviewComments(id) {
  const queryString = `
  SELECT * FROM comments 
  WHERE review_id = $1 
  ORDER BY created_at DESC;
  `;
  const value = [id];
  return db.query(queryString, value).then((response) => {
    // if (response.rowCount === 0) {
    //   return Promise.reject({
    //     status: 404,
    //     msg: `No review found for review_id ${id}`,
    //   });
    // }
    const comments = response.rows;
    const mappedComments = comments.map((comment) => {
      comment.created_at = Number(comment.created_at);
      return comment;
    });
    return mappedComments;
  });
}

function checkReviewIdExists(id) {
  console.log(id);
  const queryString = `
SELECT * FROM reviews
WHERE review_id = $1
`;
  const value = [id];
  return db.query(queryString, value).then((response) => {
    if (response.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `No review found for review_id ${id}`,
      });
    }
    return response.rows;
  });
}


function fetchReviews() {
  const queryString =
    "SELECT reviews.review_id, owner, title, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.comment_id) as comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer ORDER BY reviews.created_at DESC;";
  return db.query(queryString).then((res) => {
    const reviews = res.rows;
    const mappedReviews = reviews.map((review) => {
      review.comment_count = Number(review.comment_count);
      review.created_at = Number(review.created_at);
      return review;
    });
    return mappedReviews;
  });
}

module.exports = { fetchReview, fetchReviews, fetchReviewComments, checkReviewIdExists };
