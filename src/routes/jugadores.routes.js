module.exports = app => {
    const router = require("express").Router();
    const jugadores = require("../controller/jugadores.controller");
    
    //obtener todos los jugadores
    router.get("/", jugadores.findJugadoresPropios);

    //insertar jugador
    router.post("/", jugadores.saveJugadorPropio);

    //editar jugador
    router.put("/:idJugador", jugadores.editJugadorPropio);

    //borrar jugador
    router.delete("/:idJugador", jugadores.deleteJugadorPropio);

    app.use("/api/jugadores", router);
}