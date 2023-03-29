const db = require("../db/connection");

function removeComment(id) {
  const queryString = `
DELETE FROM comments 
WHERE comment_id = $1;
`;
  return db.query(queryString, [id]).then((response) => {
    if (response.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `Comment ID ${id} not found`,
      });
    }
    return response;
  });
}

module.exports = { removeComment };
