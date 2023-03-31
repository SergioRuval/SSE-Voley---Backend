module.exports = app => {
    const router = require("express").Router();
    const jugadores = require("../controller/jugadores.controller");
    
    //obtener todos los jugadores
    router.get("/", jugadores.findJugadoresPropios);

    //insertar equipo
    // router.post("/", );

    app.use("/api/jugadores", router);
}