const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;
const fs = require("fs");
const path = require("path");
const { Console } = require("console");

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
  const contentType = req.headers["content-type"];
  // console.log({ contentType });
  const boundary = "--" + contentType.split(";")[1].split("=")[1];
  // console.log({ boundary });
  let buf = new Buffer.alloc(0);
  req.on("data", (chunk) => {
    // buf += chunk.toString();
    buf = Buffer.concat([buf, chunk]);
  });
  req.on("close", () => {
    // console.log(buf.toString());
    console.log("buf.length:  ", buf.length);
    console.log("str length:  ", buf.toString("ascii").length);
    console.log("new buf:  ", Buffer.from(buf.toString("ascii"), "ascii").length);
    // fs.readFile(path.join(__dirname, "..", "..", fileName), (err, data) => {
    //   data = data.toString();
    //   Console.log("===========================", data.includes(buf.toString()));
    //   Console.log("===========================", buf.toString().includes(data));
    //   console.log("comparison finished");
    // });
    const tokens = buf
      .toString("ascii")
      .split(boundary)
      .map((elem) => elem.split("\r\n").filter((elem) => elem));
    // console.log(tokens);
    for (const token of tokens) {
      if (token.length === 0) continue;

      const [disposition, name, fileInfo] = token[0].split(";");
      if (name && name.split("=")[1] === '"profilePicture"' && fileInfo.trim().startsWith("filename")) {
        const content = token.slice(2).join("\r\n");
        // const content = buf.toString().split(token[1])[1];
        // console.log(token[2]);
        console.log("token length ----------------------------------", token.length);
        const fileName = fileInfo.split("=")[1].replaceAll('"', "");
        // console.log(fileName);
        fs.writeFile(path.join(__dirname, "..", "receivedFiles", fileName), content, (err) => {
          if (err) {
            console.log(err);
            res.status(500).send({
              message: "Error while saving file",
              error: err.message,
            });
          } else {
            res.send({ message: "File saved successfully" });
          }
          fs.readFile(path.join(__dirname, "..", "..", fileName), (err, data) => {
            console.log("===========================", buf.includes(data));

            // console.log(data.toString());
            // console.log(data.toString().startsWith(content));
            fs.readFile(path.join(__dirname, "..", "receivedFiles", fileName), (err, d) => {
              if (err) {
                console.log(err);
              } else {
                // data = data.toString();
                // console.log("===========================", data.includes(buf.toString()));
                // console.log("===========================", buf.toString().includes(data));
                // // console.log("===========================", content.includes(data));
                // console.log("===========================", data === d.toString());
                // for (let i = 0; i < data.length; i++) {
                //   if (data[i] !== content[i]) {
                //     console.log("Not equal at: " + i);
                //     break;
                //   }
                // }
                // console.log("comparison finished");
              }
            });
          });
        });
        return;
      }
    }
    res.status(400).send({ message: "invalid form for profie picture" });
  });
};
