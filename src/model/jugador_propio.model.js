const { Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../mysql");

const Jugador_Propio = sequelize.define('jugador_propio', {
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
        lesiones: DataTypes.BOOLEAN,
        titular: DataTypes.BOOLEAN
    },{
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Jugador_Propio;