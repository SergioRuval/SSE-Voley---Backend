module.exports = app => {
    const router = require("express").Router();
    const usuarios = require("../controller/usuarios.controller");
    
    //obtener todos los usuarios
    router.get("/", usuarios.findAll);
    router.get("/uno", usuarios.findOneUser);
    router.post("/login", usuarios.login);
    router.post("/", usuarios.register);

    app.use("/api/usuarios", router);
}