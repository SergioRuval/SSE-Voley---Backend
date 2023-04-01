const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../mysql");

const Equipo = require("./equipo.model");
const Jugador = require("./jugador_propio.model");

const Equipo_Jugador_Propio = sequelize.define("equipo_jugador_propio", {}, {
    freezeTableName: true,
    timestamps: false
});

// Definimos las relaciones entre las entidades
Equipo.belongsToMany(Jugador, { 
    through: Equipo_Jugador_Propio,
    foreignKey: 'id_equipo',
    otherKey: 'id_jugador'
});

Jugador.belongsToMany(Equipo, {
    through: Equipo_Jugador_Propio,
    foreignKey: 'id_jugador',
    otherKey: 'id_equipo'
});

module.exports = Equipo_Jugador_Propio;