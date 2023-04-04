module.exports = app => {
    const router = require("express").Router();
    const equipos = require("../controller/equipos.controller");
    
    //obtener todos los equipos
    router.get("/", equipos.findAll);

    //insertar equipo
    router.post("/", equipos.create);

    //asociar un jugador a un equipo
    router.put("/:idEquipo/jugadorPropio/:idJugador", equipos.asociatePlayer);

    //obtener un equipo por id
    router.get("/:idEquipo", equipos.findByID);

    //insertar una competencia a un equipo
    router.post("/:idEquipo/competencia", equipos.createTournament);

    app.use("/api/equipos", router);
}