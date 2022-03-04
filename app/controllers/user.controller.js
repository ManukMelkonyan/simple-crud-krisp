const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;
const fs = require("fs");
const path = require("path");

module.exports.getAll = (req, res) => {
  Users.findAll({
    attributes: ["id", "firstName", "userName", "email"],
  })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

module.exports.getById = (req, res) => {
  const id = req.params.id;

  Users.findByPk(id, {
    attributes: ["id", "firstName", "userName", "email"],
  })
    .then((user) => {
      if (user) {
        res.send(user);
        return;
      }
      res.status(404).send({
        message: `User with id <${id}> not found.`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

module.exports.update = (req, res) => {
  const id = req.params.id;
  const newParams = req.body;

  Users.findByPk(id, {
    attributes: ["id", "firstName", "userName", "email"],
  }).then((user) => {
    if (user) {
      user.update(newParams).then((user) => {
        res.send({ message: "Updated succesfully", user });
      });
    } else {
      res.status(404).send({
        message: `User with id <${id}> not found.`,
      });
    }
  });
};

module.exports.create = (req, res) => {
  const user = req.body;

  if (!user.firstName || !user.userName || !user.email || !user.password) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Users.create(user)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

module.exports.delete = (req, res) => {
  const id = req.params.id;

  Users.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

module.exports.uploadPicture = (req, res) => {
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // endpoint: /users/:id/picture
  // send image via multipart/form-data in the following format:
  //                                                            (file key) -> profilePicture
  //                                                            value -> file
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const contentType = req.headers["content-type"];
  const boundary = "--" + contentType.split(";")[1].split("=")[1];
  let buf = new Buffer.alloc(0);
  req.on("data", (chunk) => {
    buf = Buffer.concat([buf, chunk]);
  });
  req.on("close", () => {
    const tokens = buf
      .toString("ascii")
      .split(boundary)
      .map((elem) => elem.split("\r\n"))
      .filter((elem) => elem);
    console.log(
      tokens.reduce((acc, curr) => {
        if (!acc) acc++;
        return acc;
      }, 0)
    );
    for (const token of tokens) {
      if (token.length === 0) continue;
      if (!token[1]) continue;

      console.log(
        tokens.reduce((acc, curr) => {
          if (!acc) acc++;
          return acc;
        }, 0)
      );
      const [disposition, name, fileInfo] = token[1].split(";");
      if (name && name.split("=")[1] === '"profilePicture"' && fileInfo.trim().startsWith("filename")) {
        const fileName = fileInfo.split("=")[1].replaceAll('"', "");
        fs.writeFile(
          path.join(__dirname, "..", "receivedFiles", fileName),
          buf.slice(buf.toString("ascii").indexOf(token[4]), buf.length - boundary.length - 6),
          (err) => {
            if (err) {
              console.log(err);
              res.status(500).send({
                message: "Error while saving file",
                error: err.message,
              });
            } else {
              res.send({ message: "File saved successfully" });
            }
          }
        );
        return;
      }
    }
    res.status(400).send({ message: "invalid form for profie picture" });
  });
};
