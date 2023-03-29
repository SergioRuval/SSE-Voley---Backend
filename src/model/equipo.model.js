const { Sequelize, DataTypes, STRING } = require("sequelize");
const sequelize = require("../mysql");

const Equipo = sequelize.define('equipo', {
        id: {
            type: DataTypes.BIGINT(20), 
            primaryKey: true, 
            allowNull: false,
            autoIncrement: true
        },
        categoria: DataTypes.STRING,
        contrario: DataTypes.BOOLEAN,
        nombre_entidad: DataTypes.STRING,
        nombre_equipo: DataTypes.STRING,
        rama: DataTypes.STRING,
        tipo_equipo: DataTypes.STRING
    },{
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Equipo;