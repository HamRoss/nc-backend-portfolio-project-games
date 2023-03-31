const db = require("../db/connection");

function fetchReview(id) {
  const queryString = `SELECT reviews.*,
COUNT(comments.comment_id) as comment_count
FROM
reviews
LEFT JOIN
comments
ON
reviews.review_id = comments.review_id
WHERE
reviews.review_id = $1
GROUP BY
reviews.review_id;
  `;
  const value = [id];
  return db.query(queryString, value).then((response) => {
    const review = response.rows[0];
    if (!review) {
      return Promise.reject({
        status: 404,
        msg: `No review found for review_id ${id}`,
      });
    }
    review.comment_count = Number(review.comment_count);
    return review;
  });
}

function checkCategoryExists(category) {
  const queryString = `
  SELECT * 
  FROM categories
  WHERE slug = $1;
  `;
  const queryValue = [category];
  return db.query(queryString, queryValue).then((response) => {
    if (response.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `Category ${category} not found`,
      });
    }
    return response.rows;
  });
}

function fetchReviewComments(id) {
  const queryString = `
  SELECT * FROM comments 
  WHERE review_id = $1 
  ORDER BY created_at DESC;
  `;
  return db.query(queryString, [id]).then((response) => {
    const comments = response.rows;
    const mappedComments = comments.map((comment) => {
      comment.created_at = Number(comment.created_at);
      return comment;
    });
    return mappedComments;
  });
}

function checkReviewIdExists(id) {
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

function fetchReviews(category, sortBy = "reviews.created_at", order = "desc") {
  if (
    ![
      "review_id",
      "owner",
      "title",
      "category",
      "review_img_url",
      "created_at",
      "votes",
      "designer",
      "comment_count",
      "reviews.created_at",
    ].includes(sortBy)
  ) {
    return Promise.reject({ status: 400, msg: `You can't sort by ${sortBy}` });
  }
  if (!["asc", "desc", "ASC", "DESC"].includes(order)) {
    return Promise.reject({ status: 400, msg: `You can't order by ${order}` });
  }

  if (sortBy === "comment_count") {
    sortBy = "COUNT(comments.comment_id)";
  }
  const queryValues = [];
  let queryString = `
    SELECT reviews.review_id, owner, title, category, review_img_url, reviews.created_at, reviews.votes, designer, 
    COUNT(comments.comment_id) as comment_count 
    FROM reviews
    LEFT JOIN comments 
    ON reviews.review_id = comments.review_id 
    `;
  if (category) {
    queryValues.push(category);
    queryString += `WHERE category = $1`;
  }
  queryString += ` 
    
    GROUP BY reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer 
    ORDER BY ${sortBy} ${order};`;
  return db.query(queryString, queryValues).then((res) => {
    const reviews = res.rows;
    const mappedReviews = reviews.map((review) => {
      review.comment_count = Number(review.comment_count);
      review.created_at = Number(review.created_at);
      return review;
    });
    return mappedReviews;
  });
}

function insertReviewComment(author, body, reviewId) {
  const queryString = `
INSERT INTO comments
(body, review_id, author)
VALUES ($1, $2, $3)
RETURNING *;
`;

  const values = [body, reviewId, author];

  return db.query(queryString, values).then((response) => {
    return response.rows[0];
  });
}

function updateVotes(id, votes) {
  const queryString = `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2 
  RETURNING *;`;
  const values = [votes, id];
  return db.query(queryString, values).then((response) => {
    if (response.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `Can't update votes. Review ID ${id} not found`,
      });
    }
    return response.rows[0];
  });
}

module.exports = {
  fetchReview,
  fetchReviews,
  fetchReviewComments,
  checkReviewIdExists,
  insertReviewComment,
  updateVotes,
  checkCategoryExists,
};
