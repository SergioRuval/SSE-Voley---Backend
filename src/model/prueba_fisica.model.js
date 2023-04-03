const { Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../mysql");
const Equipo = require("../model/equipo.model");

const Prueba_Fisica = sequelize.define('prueba_fisica', {
        id: {
            type: DataTypes.BIGINT(20), 
            primaryKey: true, 
            allowNull: false,
            autoIncrement: true
        },
        aplicada: DataTypes.STRING,
        ciclo: DataTypes.BOOLEAN,
        fecha: DataTypes.STRING,
        id_equipo: DataTypes.STRING,
        nombre: DataTypes.STRING
    },{
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Prueba_Fisica;