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

module.exports = { fetchReview, fetchReviewComments, checkReviewIdExists };
