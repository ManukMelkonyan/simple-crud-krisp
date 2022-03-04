const validateId = (req, res, next) => {
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

const validateEmail = (req, res, next) => {
  const email = req.body.email;
  const validRegex = /^([a-zA-Z]+[\-\_\.]?[a-zA-Z]+)\@([a-zA-Z]+\.[a-zA-Z]{2, })$/;
  if (validRegex.test(email)) {
    next();
  } else {
    res.status(400).send({
      message: "Invalid email",
    });
  }
};

const validatePassword = (req, res, next) => {
  const password = req.body.password;
  const validRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
};
