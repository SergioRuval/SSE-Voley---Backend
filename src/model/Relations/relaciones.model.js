const Usuario = require("../usuario.model");
const Prueba_Fisica = require("../prueba_fisica.model");
const Jugador_Propio = require("../jugador_propio.model");
const Jugador_Contrario = require("../jugador_contrario.model");
const Equipo = require("../equipo.model");
const Competencia = require("../competencia.model");

// Tablas intermedias
const Equipo_Jugador_Propio = require("../equipo_jugador_propio.model");
const Equipo_Jugador_Contrario = require("../equipo_jugador_contrario.model");
const Usuario_Equipo = require("../usuario_equipo.model");


// Relaciones de Equipo con Competencia
Equipo.hasMany(Competencia, { foreignKey: "id_equipo" });
Competencia.belongsTo(Equipo, { foreignKey: "id_equipo" });

// Relaciones de Equipo con Prueba Física
Equipo.hasMany(Prueba_Fisica, { foreignKey: "id_equipo" });
Prueba_Fisica.belongsTo(Equipo, { foreignKey: "id_equipo" });

// Relaciones de Equipo con jugador propio
Equipo.belongsToMany(Jugador_Propio, { 
    through: Equipo_Jugador_Propio,
    foreignKey: 'id_equipo',
    otherKey: 'id_jugador'
});

Jugador_Propio.belongsToMany(Equipo, {
    through: Equipo_Jugador_Propio,
    foreignKey: 'id_jugador',
    otherKey: 'id_equipo'
});

// Relaciones de Equipo con jugador contrario
Equipo.belongsToMany(Jugador_Contrario, {
    through: Equipo_Jugador_Contrario,
    foreignKey: 'id_equipo',
    otherKey: 'id_jugador'
});

Jugador_Contrario.belongsToMany(Equipo, {
    through: Equipo_Jugador_Contrario,
    foreignKey: 'id_jugador',
    otherKey: 'id_equipo'
});

// Relaciones de Usuario con Equipo
Usuario.belongsToMany(Equipo, { 
    through: Usuario_Equipo,
    foreignKey: 'id_usuario',
    otherKey: 'id_equipo'
});
Equipo.belongsToMany(Usuario, {
    through: Usuario_Equipo,
    foreignKey: 'id_equipo',
    otherKey: 'id_usuario'
});

module.exports = { Usuario, Equipo, Jugador_Propio, Jugador_Contrario ,Prueba_Fisica, 
    Equipo_Jugador_Propio, Equipo_Jugador_Contrario, Usuario_Equipo, Competencia };