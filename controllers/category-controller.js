const { fetchCategories } = require("../models/category-model");

function getCategories(req, res) {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
}

module.exports = { getCategories };
