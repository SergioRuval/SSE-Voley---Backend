const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    "ssevolley",
    "root",
    "",
    {
        host: "localhost",
        dialect: 'mysql'
    }
);

module.exports = sequelize;