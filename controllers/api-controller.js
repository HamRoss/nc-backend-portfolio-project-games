const { fetchEndpoints } = require("../models/api-model");

function getEndpoints(req, res, next) {
  fetchEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getEndpoints };
