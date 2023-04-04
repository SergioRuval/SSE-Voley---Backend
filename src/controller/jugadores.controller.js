const Equipo_Jugador_Propio = require("../model/equipo_jugador_propio.model");
const JugadorPropio = require("../model/jugador_propio.model");
const JugadorContrario = require("../model/jugador_contrario.model");


// Para encontrar los jugadores propios lo que tengo que hacer es pasar el id del equipo propio
// Esto me devolverá un listado de ids de jugadores para el equipo que necesito
// Con ese listado, voy obteniendo los jugadores que correspondan a dichos ids
// Ese listado de jugadores es el que voy a devolver en la respuesta
exports.findJugadoresPropios = async (req, res) => {
    await JugadorPropio.findAll().then((data) => {
        res.status(200).json(data);
    });
}

// Para encontrar los jugadores contrarios hacemos básicamente lo mismo que con jugadores propios
// La diferencia es que esta vez recibiremos un equipo contrario, del que usaremos su id para
// Buscar en la tabla equipo_jugador_contrario los ids de los jugadores de dicho equipo y poder
// obtenerlos todos desde la tabla de jugadores contrarios
exports.findJugadoresContrarios = (req, res) => {
    
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

// Para guardar el jugador necesitamos guardarlo en la tabla jugador propio
// Desde el body de la petición obtenemos los campos correspondientes al jugador
// Validamos que ninguno de dichos campos esté vacío
// Luego hacemos la inserción por medio del modelo de Sequelize
exports.saveJugadorContrario = async (req, res) =>{
    if(!req.body.genero || !req.body.no_jugador || !req.body.nombre || !req.body.posicion){
        console.log("ERROR: no puede haber campos vacíos al insertar un jugador");
        res.status(400).send(null);
        return;
    }

    try {
        const { capitan, genero, no_jugador, nombre, posicion } = req.body;
        const nuevoJugador = await JugadorContrario.create({
            capitan: capitan,
            genero: genero,
            no_jugador: no_jugador,
            nombre: nombre,
            posicion: posicion
        });
        console.log("Jugador añadido satisfactoriamente");
        res.status(200).json(nuevoJugador);
    }catch (err) {
        console.error(err);
        res.status(500).send(null);
    }
}

// Para editar obtenemos el id del jugador y checamos que no esté vacío
// Luego validamos que los datos del jugador tampoco estén vacíos
// Después validamos que el jugador a editar exista
// Luego construimos el objeto de jugador para sustituir los campos
// Hacemos el update con el modelo de Sequelize
// Si se actualiza 1 registro, entonces obtenemos el jugador editado y lo enviamos
exports.editJugadorPropio = async (req, res) => {
    if(!req.params.idJugador){
        console.log("ERROR: no puede haber un id vacío");
        res.status(400).send(null);
        return;
    }

    if(!req.body.genero || !req.body.no_jugador || !req.body.nombre || !req.body.posicion){
        console.log("ERROR: no puede haber campos vacíos al editar un jugador");
        res.status(400).send(null);
        return;
    }

    const jugador = await JugadorPropio.findAll({
        where: { id: req.params.idJugador }
    });

    if(jugador.length === 0){
        console.log("Id de jugador no encontrado");
        res.status(400).send(null);
        return;
    }

    try {
        const { capitan, genero, lesiones, no_jugador, nombre, posicion, titular  } = req.body;
        const registrosEditados = await JugadorPropio.update(
            {
                capitan: capitan,
                genero: genero,
                no_jugador: no_jugador,
                nombre: nombre,
                posicion: posicion,
                lesiones: lesiones,
                titular: titular
            },
            {
                where: { id: req.params.idJugador }
            }
        );
        if(registrosEditados.length > 0){
            console.log("Jugador añadido satisfactoriamente");
            const jugadorEditado = await JugadorPropio.findAll({
                where: { id: req.params.idJugador }
            });

            if(jugadorEditado.length > 0){
                res.status(200).json(jugadorEditado[0]);
            }else{
                console.log("No se pudo obtener al jugador editado");
                res.status(500).send(null);
            }
        }else{
            console.log("Jugador no editado");
            res.status(500).send(null);
        }
    }catch (err) {
        console.error(err);
        res.status(500).send(null);
    }
}

// Para borrar un jugador primero validamos que llegue un id no vacío
// Luego validamos que el jugador exista
// Si existe, borramos primero el registro en la tabla que lo relaciona con un equipo
// Luego lo borramos de la tabla de jugadores
exports.deleteJugadorPropio = async (req, res) => {
    if(!req.params.idJugador){
        console.log("ERROR: no puede haber un id vacío");
        res.status(400).send(null);
        return;
    }

    const jugador = await JugadorPropio.findAll({
        where: { id: req.params.idJugador }
    });

    if(jugador.length === 0){
        console.log("ERROR: no se encontró al jugador");
        res.status(400).send(null);
        return;
    }

    const asociacionEquipo = await Equipo_Jugador_Propio.destroy({
        where: { id_jugador: req.params.idJugador }
    });

    if(asociacionEquipo > 0){
        console.log("Asociación del jugador con equipos eliminada");
    }else{
        console.log("ERROR: no se pudo desasociar al jugador");
        res.status(500).send(null);
        return;
    }

    const jugadoresEliminados = await JugadorPropio.destroy({
        where: { id: req.params.idJugador }
    });

    if(jugadoresEliminados > 0){
        res.status(200).send({
            message: "Jugador eliminado con éxito"
        });
        return
    }else{
        console.log("ERROR: no se pudo eliminar al jugador");
        res.status(500).send(null);
        return;
    }
}