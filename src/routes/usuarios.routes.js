module.exports = app => {
    const router = require("express").Router();
    const usuarios = require("../controller/usuarios.controller");
    
    //obtener todos los usuarios
    router.get("/", usuarios.findAll);
    
    //insertar nuevo usuario
    router.post("/", usuarios.register);

    //obtener un usuario en base al id
    router.get("/uno", usuarios.findOneUser);

    //checar credenciales para iniciar sesión
    router.post("/login", usuarios.login);

    //asociar un equipo a un usuario
    router.put("/:idUsuario/equipo/:idEquipo", usuarios.asociateTeam);

    //obtener los equipos por usuario
    router.get("/:idUsuario/equipos", usuarios.findTeams);

    //obtener los equipos rivales por usuario
    router.get("/:idUsuario/equiposRivales", usuarios.findRivalTeams);

    app.use("/api/usuarios", router);
}