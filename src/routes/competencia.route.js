module.exports = app => {
    const router = require("express").Router();
    const competencias = require("../controller/competencia.controller")

    //editar una competencia
    router.put("/:idCompetencia", competencias.editTournament);

    app.use("/api/competencias", router);
}