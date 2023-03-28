const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err);
  } else {
    next(err);
  }
};

const handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required field(s)" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Username does not exist" });
  } else {
    next(err);
  }
};

const handle500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = { handleCustomErrors, handlePsqlErrors, handle500Errors };
