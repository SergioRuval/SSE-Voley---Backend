module.exports = app => {
    const router = require("express").Router();
    const equipos = require("../controller/equipos.controller");
    
    //obtener todos los equipos
    router.get("/", equipos.findAll);

    //insertar equipo
    router.post("/", equipos.create);

    app.use("/api/equipos", router);
}