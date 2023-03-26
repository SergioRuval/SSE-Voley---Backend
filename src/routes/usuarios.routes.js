module.exports = app => {
    const router = require("express").Router();
    const usuarios = require("../controller/usuarios.controller");
    
    //obtener todos los usuarios
    router.get("/", usuarios.findAll);

    app.use("/api/usuarios", router);
}