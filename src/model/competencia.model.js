const { Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../mysql");

const Competencia = sequelize.define('competencia', {
        id: {
            type: DataTypes.BIGINT(20), 
            primaryKey: true, 
            allowNull: false,
            autoIncrement: true
        },
        activa: DataTypes.BOOLEAN,
        fecha_fin: DataTypes.STRING,
        fecha_inicio: DataTypes.STRING,
        nombre: DataTypes.STRING,
        id_equipo: DataTypes.BIGINT(20),
        id_tipo: DataTypes.BIGINT(20)
    },{
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Competencia;