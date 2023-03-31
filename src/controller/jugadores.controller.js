const JugadorPropio = require("../model/jugador_propio.model");


// Para encontrar los jugadores propios lo que tengo que hacer es pasar el id del equipo propio
// Esto me devolverá un listado de ids de jugadores para el equipo que necesito
// Con ese listado, voy obteniendo los jugadores que correspondan a dichos ids
// Ese listado de jugadores es el que voy a devolver en la respuesta
exports.findJugadoresPropios = async (req, res) => {
    await JugadorPropio.findAll().then((data) => {
        res.status(200).json(data);
    });
}

exports.findJugadoresContrarios = (req, res) => {
    // Para encontrar los jugadores contrarios hacemos básicamente lo mismo que con jugadores propios
    // La diferencia es que esta vez recibiremos un equipo contrario, del que usaremos su id para
    // Buscar en la tabla equipo_jugador_contrario los ids de los jugadores de dicho equipo y poder
    // obtenerlos todos desde la tabla de jugadores contrarios
}

exports.findJugadorPropio = (req, res) => {
    // En este caso vamos a encontrar un jugador propio de un equipo usando su id
    // Para esto tomamos el id del equipo y el id del jugador, y los mandamos para ver si existe un
    // registro en la tabla equipo_jugador_propio.
    // Si hay éxito, usamos el id para retornar al jugador correspondiente
}

exports.findJugadorContrario = (req, res) => {
    // En este caso vamos a encontrar un jugador contrario de un equipo usando su id
    // Para esto tomamos el id del equipo y el id del jugador, y los mandamos para ver si existe un
    // registro en la tabla equipo_jugador_contrario.
    // Si hay éxito, usamos el id para retornar al jugador correspondiente
}

exports.saveJugadorPropio = (req, res) => {
    // Para guardar el jugador necesitamos guardarlo en la tabla jugador propio
    // Luego usar el id del equipo al que está asociado para agregar un nuevo registro en la tabla
    // equipo_jugador_propio.
}