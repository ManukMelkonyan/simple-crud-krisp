const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: { ...dbConfig.pool },
  logging: false,
});

const db = {
  sequelize,
  Sequelize,
  users: require("./user.model.js")(sequelize, Sequelize),
};

module.exports = db;
