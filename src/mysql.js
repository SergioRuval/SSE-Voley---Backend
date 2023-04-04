const Sequelize = require("sequelize");

const sequelize = new Sequelize({
    database: "ssevolley",
    username: "root",
    password: "",
    host: "localhost",
    dialect: 'mysql'
});

module.exports = sequelize;