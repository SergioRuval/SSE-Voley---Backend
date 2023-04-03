const { Sequelize, DataTypes, STRING } = require("sequelize");
const sequelize = require("../mysql");

const Usuario = require("./usuario.model");
const Equipo = require("./equipo.model");

const Usuario_Equipo = sequelize.define('usuario_equipo', {},{
    freezeTableName: true,
    timestamps: false
});

// // Definimos la relación de usuario y equipo
// Usuario.belongsToMany(Equipo, { 
//     through: Usuario_Equipo,
//     foreignKey: 'id_usuario',
//     otherKey: 'id_equipo'
// });
// Equipo.belongsToMany(Usuario, {
//     through: Usuario_Equipo,
//     foreignKey: 'id_equipo',
//     otherKey: 'id_usuario'
// });

module.exports = Usuario_Equipo;