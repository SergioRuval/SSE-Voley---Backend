module.exports = app => {
    const router = require("express").Router();
    const equipos = require("../controller/equipos.controller");
    //obtener todos los clientes
    router.get("/", equipos.findAll);

    app.use("/api/equipos", router);
}