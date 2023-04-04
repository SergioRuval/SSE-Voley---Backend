const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../mysql");

const Equipo_Jugador_Contrario = sequelize.define("equipo_jugador_contrario", {}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Equipo_Jugador_Contrario;