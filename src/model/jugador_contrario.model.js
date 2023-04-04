const { Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../mysql");

const Jugador_Contrario = sequelize.define('jugador_contrario', {
        id: {
            type: DataTypes.BIGINT(20), 
            primaryKey: true, 
            allowNull: false,
            autoIncrement: true
        },
        capitan: DataTypes.BOOLEAN,
        genero: DataTypes.CHAR,
        no_jugador: DataTypes.INTEGER(11),
        nombre: DataTypes.STRING,
        posicion: DataTypes.STRING,
    },{
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Jugador_Contrario;