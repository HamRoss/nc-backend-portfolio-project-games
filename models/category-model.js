const db = require("../db/connection");

function fetchCategories() {
  const queryString = "SELECT * FROM categories;";
  return db.query(queryString).then((res) => {
    return res.rows;
  });
}

module.exports = { fetchCategories };
