module.exports = (req, res, next) => {
  const id = req.params.id;
  const validRegex = /^\d+$/;
  if (validRegex.test(id)) {
    next();
  } else {
    res.status(400).send({
      message: "Invalid id",
    });
  }
};
