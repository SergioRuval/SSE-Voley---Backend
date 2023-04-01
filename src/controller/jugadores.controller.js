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

// Para guardar el jugador necesitamos guardarlo en la tabla jugador propio
// Desde el body de la petición obtenemos los campos correspondientes al jugador
// Validamos que ninguno de dichos campos esté vacío
// Luego hacemos la inserción por medio del modelo de Sequelize
exports.saveJugadorPropio = async (req, res) => {
    if(!req.body.genero || !req.body.no_jugador || !req.body.nombre || !req.body.posicion){
        console.log("ERROR: no puede haber campos vacíos al insertar un jugador");
        res.status(400).send(null);
        return;
    }

    try {
        const { capitan, genero, lesiones, no_jugador, nombre, posicion, titular } = req.body;
        const nuevoJugador = await JugadorPropio.create({
            capitan: capitan,
            genero: genero,
            no_jugador: no_jugador,
            nombre: nombre,
            posicion: posicion,
            lesiones: lesiones,
            titular: titular
        });
        console.log("Jugador añadido satisfactoriamente");
        res.status(200).json(nuevoJugador);
    }catch (err) {
        console.error(err);
        res.status(500).send(null);
    }
}