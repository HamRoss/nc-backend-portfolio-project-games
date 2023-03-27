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

module.exports = { fetchReview };
