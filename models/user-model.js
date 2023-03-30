const db = require("../db/connection");

function fetchUsers() {
  const queryString = `
    SELECT * 
    FROM users;
    `;
  return db.query(queryString).then((res) => {
    return res.rows;
  });
}

module.exports = { fetchUsers };
