const { removeComment } = require("../models/comment-model");

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((response) => {
      res.status(204).send(response);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { deleteComment };
