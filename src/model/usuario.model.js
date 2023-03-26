const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../mysql");

const Usuario = sequelize.define('usuario', {
        id: {
            type: DataTypes.BIGINT(20), 
            primaryKey: true, 
            allowNull: false,
            autoIncrement: true
        },
        nombre: DataTypes.STRING,
        apellidos: DataTypes.STRING,
        password: DataTypes.STRING,
        rol: DataTypes.STRING(20),
        username: DataTypes.STRING
    }, {
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Usuario;