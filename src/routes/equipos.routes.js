module.exports = app => {
    const router = require("express").Router();
    const equipos = require("../controller/equipos.controller");
    
    //obtener todos los equipos
    router.get("/", equipos.findAll);

    //insertar equipo
    router.post("/", equipos.create);

    //editar un equipo
    router.put("/:idEquipo", equipos.update);

    //asociar un jugador a un equipo
    router.put("/:idEquipo/jugadorPropio/:idJugador", equipos.asociatePlayer);

    //asociar un jugador contrario a un equipo contrario
    router.put("/:idEquipo/jugadorContrario/:idJugadorRival", equipos.asociateRivalPlayer);

    //obtener un equipo por id
    router.get("/:idEquipo", equipos.findByID);

    // Eliminar un equipo por id
    router.delete("/:idEquipo", equipos.delete);

    //insertar una competencia a un equipo
    router.post("/:idEquipo/competencia", equipos.createTournament);

    //eliminar una competencia
    router.delete("/:idEquipo/competencia/:idCompetencia", equipos.deleteTournament);

    app.use("/api/equipos", router);
}