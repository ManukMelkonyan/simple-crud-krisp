const express = require("express");
const app = express();
const db = require("./app/models");
const userRouter = require("./app/routes/user.routes");

const PORT = process.env.PORT || 5000;

db.sequelize.sync();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
