const {Equipo, Jugador_Propio, Jugador_Contrario ,Prueba_Fisica, 
    Equipo_Jugador_Propio, Equipo_Jugador_Contrario, Competencia, Usuario_Equipo} = require("../model/Relations/relaciones.model.js");

// Para obtener los equipos hay que simplemente hacer la búsqueda en la BD
// El detalle sería obtener los equipos contrarios, ya que estos tienen un campo adicional a validar
// Para esto puedo crear dos endpoints diferentes, uno para los equipos propios y uno para los contrarios
// y así separar la lógica de ambos
exports.findAll = async (req, res) => {
    await Equipo.findAll().then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        throw err;
    });
}

// Para encontrar por ID necesito obtener el ID de la petición req
// Luego uso ese valor para hacer el query correspondiente SELECT * FROM equipo WHERE id = ${id}
// Por último retorno el equipo encontrado
exports.findByID = async (req, res) => {
    if(!req.params.idEquipo){
        console.log("ERROR: No se puede registrar un equipo con un campo vacío");
        res.status(400).send(null);
        return;
    }

    try {
        const equipo = await Equipo.findAll({
            where: { id: req.params.idEquipo },
            include: [
                {
                    model: Jugador_Propio,
                    through: { model: Equipo_Jugador_Propio }
                },
                {
                    model: Prueba_Fisica
                },
                {
                    model: Competencia
                }
            ]
        });
    
        if(equipo.length === 0){
            console.log("Id de equipo no encontrado");
            res.status(400).send(null);
            return;
        }else{
            res.status(200).json(equipo[0]);
        }
    } catch (error) {
        console.log("ERROR: No se pudo obtener el equipo - " + error.message);
        res.status(500).send(null);
    }
    
}

// Para crear un equipo primero hay que obtener el objeto json desde la petición req
// Este deberíamos pasarlo al modelo de datos para poder insertarlo a la BD
// Luego retornamos un resultado exitoso en caso de que se haya insertado
exports.create = async (req, res) => {
    if(!req.body.categoria || !req.body.nombre_entidad || 
        !req.body.nombre_equipo || !req.body.rama || !req.body.tipo_equipo){
            console.log("ERROR: No se puede registrar un equipo con un campo vacío");
            res.status(400).send(null);
            return;
        }

    // Si no está vacía, hacemos el registro en la BD obteniendo los campos del body primero
    try {
        const { categoria, contrario, nombre_entidad, nombre_equipo, 
            rama, tipo_equipo } = req.body;
        const nuevoEquipo = await Equipo.create({
            categoria: categoria,
            contrario: contrario  == "False" ? false : true,
            nombre_entidad: nombre_entidad,
            nombre_equipo: nombre_equipo,
            rama: rama,
            tipo_equipo: tipo_equipo
        });
        res.status(200).json(nuevoEquipo);
    }catch (err) {
        console.error(err);
        res.status(500).send(null);
    }
}

//Para borrar un equipolo primero es verificar que el id no esté vacío
//Luego hay que validar que el equipo exista en la bd
//Después hay que eliminar los jugadores sí y solo sí solo forman parte de este equipo
//Una vez eliminados los jugadores, eliminamos la asociación de equipo y usuario
//Por último borramos el equipo
exports.delete =  async (req, res) => {
    if(!req.params.idEquipo){
        console.log("ERROR: No puede borrar un id vacío");
        res.status(400).send(false);
        return;
    }

    // Validemos que el equipo está en la tabla de la bd
    const equipo = await Equipo.findAll({
        where: { id: req.params.idEquipo },
        include: [
            {
                model: Jugador_Propio,
                through: { model: Equipo_Jugador_Propio }
            },{
                model: Jugador_Contrario,
                through: { model: Equipo_Jugador_Contrario }
            },
            {
                model: Prueba_Fisica
            },
            {
                model: Competencia
            }
        ]
    });
    if(equipo.length === 0){
        console.log("ERROR: No existe el equipo a borrar");
        res.status(400).send(false);
        return;
    }
        // }else{
    //     console.log("Equipo y relaciones encontrados");
    //     res.status(200).json(equipo);
    //     return;
    // }
    // Si existe, lo que sigue es borrar cada jugador, para ello obtenemos todos los jugadores
    // por su id, por medio de la tabla equipo_jugador
    // Para esto hay que validar primero si es un equipo contrario o no
    
    try {
        // Borramos cada jugador relacionado con el equipo
        let jugadoresAsociadosBorrados = await Equipo_Jugador_Propio.destroy({
            where: { 
                id_equipo: req.params.idEquipo      
            }
        });

        console.log("Jugadores propios desasociados " + jugadoresAsociadosBorrados);

        jugadoresAsociadosBorrados = await Equipo_Jugador_Contrario.destroy({
            where: {
                id_equipo: req.params.idEquipo
            }
        });

        console.log("Jugadores contrarios desasociados " + jugadoresAsociadosBorrados);

        // Luego obtenemos los jugadores
        let jugadores = equipo[0].jugador_propios;
        // Recorremos cada jugador y lo borramos de la tabla correspoindiente, en caso de que no esté en otro equipo
        jugadores.forEach(async jugador => {
            idJugador = jugador.id
            let jugadoresAunAsociados = await Equipo_Jugador_Propio.findAll({
                where: { id_jugador: idJugador }
            });

            if(jugadoresAunAsociados.length === 0){
                await Jugador_Propio.destroy({
                    where: { id: idJugador }
                }).then(result => {
                    console.log("Jugador propio " + idJugador + " borrado permanentemente con filas afectadas " + result);
                });
            }else{
                console.log("Jugador propio " + idJugador + " sigue asociado a otro equipo");
            }

            jugadoresAunAsociados = await Equipo_Jugador_Contrario.findAll({
                where: { id_jugador: idJugador }
            });

            if(jugadoresAunAsociados.length === 0){
                await Jugador_Contrario.destroy({
                    where: { id: idJugador }
                }).then(result => {
                    console.log("Jugador contrario " + idJugador + " borrado permanentemente con filas afectadas " + result);
                });
            }else{
                console.log("Jugador contrario " + idJugador + " sigue asociado a otro equipo");
            }
        });

        jugadores = equipo[0].jugador_contrarios;
        // Recorremos cada jugador y lo borramos de la tabla correspoindiente, en caso de que no esté en otro equipo
        jugadores.forEach(async jugador => {
            idJugador = jugador.id

            jugadoresAunAsociados = await Equipo_Jugador_Contrario.findAll({
                where: { id_jugador: idJugador }
            });

            if(jugadoresAunAsociados.length === 0){
                await Jugador_Contrario.destroy({
                    where: { id: idJugador }
                }).then(result => {
                    console.log("Jugador contrario " + idJugador + " borrado permanentemente con filas afectadas " + result);
                });
            }else{
                console.log("Jugador contrario " + idJugador + " sigue asociado a otro equipo");
            }
        });

        // Luego borramos las pruebas físicas
        let pruebasBorradas = await Prueba_Fisica.destroy({
            where: { id_equipo: req.params.idEquipo }
        })

        console.log("Se borraron " + pruebasBorradas + " pruebas físicas");

        // Por último borramos las competencias
        let competenciasBorradas = await Competencia.destroy({
            where: { id_equipo: req.params.idEquipo }
        });

        console.log("Se borraron " + competenciasBorradas + " competencias");

        // Procedemos a borrar su relación con el usuario
        const asociacionEquipoBorradas = await Usuario_Equipo.destroy({
            where: { id_equipo: req.params.idEquipo }
        });

        if(asociacionEquipoBorradas == 0){
            console.log("ERROR: No se pudo borrar la asociación de equipo");
            res.status(400).send(false);
            return;
        }else{
            console.log("Se borraron las asociaciones con cantidad de " + asociacionEquipoBorradas);
        }

        const equiposBorrados = await Equipo.destroy({
            where: { id: req.params.idEquipo }
        });

        if(equiposBorrados == 0){
            console.log("ERROR: No se pudo borrar la asociación de equipo");
            res.status(400).send(false);
            return;
        }else{
            console.log("Equipo borrado satisfactoriamente");
            res.status(200).send(true);
        }
    } catch (error) {
        console.log("ERROR: No se pudo borrar el equipo - " + error);
        res.status(400).send(false);
        return;
    }
    
}

// Para actualizar un equipo hay que consultar que el equipo se encuentre en la bd
// En caso de que no esté, regresamos un mensaje de error que la aplicación se encargará de procesar
// Si se encuentra, se sobreescriben los datos del viejo equipo con los del nuevo equipo
// Por último se devuelve un código de resultado exitoso por el equipo editado
exports.update = async (req, res) => {
    if(!req.params.idEquipo){
        console.log("ERROR: No puede editar un id vacío");
        res.status(400).send(false);
        return;
    }

    // Checamos que el body del request no esté vacío
    if(!req.body.categoria || !req.body.nombre_entidad || !req.body.nombre_equipo 
        || !req.body.rama || !req.body.tipo_equipo){
            console.log("ERROR: No puede editar un equipo vacío");
            res.status(400).send(null);
            return;
    }

    console.log(req.body.contrario);

    let cont
    if(req.body.contrario == "False" || !req.body.contrario){
        cont = false
    }else{
        cont = true
    }

    // Checamos que el equipo esté en la BD y sea un equipo rival
    const rival = await Equipo.findAll({
        where: {
            id: req.params.idEquipo,
            contrario: cont
        }
    });

    if(rival.length === 0){
        console.log("ERROR: Equipo no encontrado");
        res.status(400).send(null);
        return;
    }

    try {
        const { categoria, contrario, nombre_entidad, nombre_equipo, 
            rama, tipo_equipo } = req.body;
        const registrosEditados = await Equipo.update({
            categoria: categoria,
            contrario: contrario  == "False" ? false : true,
            nombre_entidad: nombre_entidad,
            nombre_equipo: nombre_equipo,
            rama: rama,
            tipo_equipo: tipo_equipo
        },{
            where: { id: req.params.idEquipo }
        });
        if(registrosEditados.length > 0){
            console.log("Equipo editado satisfactoriamente");
            const equipoEditado = await Equipo.findAll({
                where: { id: req.params.idEquipo }
            });

            if(equipoEditado.length > 0){
                res.status(200).json(equipoEditado[0]);
            }else{
                console.log("No se pudo obtener al equipo editado");
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

// Para asociar un jugador a un equipo vamos a obtener el id del jugador insertado a la bd
// Y el id del equipo donde se insertará
// Luego validamos que ambos id existan y procederemos a insertar ambos id en la tabla correspondiente
exports.asociatePlayer = async (req, res) => {
    // Validamos que los ids no estén vacíos
    if(!req.params.idEquipo || !req.params.idJugador){
        console.log("ERROR: No puede asociar un id vacío");
        res.status(400).send(false);
        return;
    }

    // Ahora verificamos que el id del equipo exista en la bd
    const equipo = await Equipo.findAll({
        where: { id: req.params.idEquipo }
    });

    if(equipo.length === 0){
        console.log("Id de equipo no encontrado");
        res.status(400).send(false);
        return;
    }

    // Validamos que exista el jugador
    const jugador = await Jugador_Propio.findAll({
        where: { id: req.params.idJugador }
    });

    if(jugador.length === 0){
        console.log("Id de jugador no encontrado");
        res.status(400).send(false);
        return;
    }

    // Ahora hacemos la inserción de ambos id en la tabla de unión
    await Equipo_Jugador_Propio.create({
        id_jugador: req.params.idJugador, 
        id_equipo: req.params.idEquipo
    }).then((data) => {
        if(data.length != 0){
            console.log("Asociación hecha");
            res.status(200).send(true);
        }
    }).catch((err) => {
        console.log("ERROR: " + err.original.message);
        res.status(400).send(false)
    });
}

// Para asociar un jugador rival obtenemos el id del jugador insertado y el del equipo
// Primero validamos que ambos id no estén vacíos
// Luego verificamos que ambos id existan
// Después verificamos que el equipo realmente sea un equipo contrario
// Una vez hecho esto podemos asociarlos insertando en la tabla equipo_jugador_contrario
exports.asociateRivalPlayer = async (req, res) => {
    // Validamos que los ids no estén vacíos
    if(!req.params.idEquipo || !req.params.idJugadorRival){
        console.log("ERROR: No puede asociar un id vacío");
        res.status(400).send(false);
        return;
    }

    // Validamos que el equipo exista en la bd y que sea un equipo contrario
    const equipo = await Equipo.findAll({
        where: { 
            id: req.params.idEquipo,
            contrario: true
        }
    });

    if(equipo.length === 0){
        console.log("Id de equipo no encontrado");
        res.status(400).send(false);
        return;
    }

    // Validamos que el jugador exista
    const jugador = await Jugador_Contrario.findAll({
        where: { id: req.params.idJugadorRival }
    });

    if(jugador.length === 0){
        console.log("Id de jugador no encontrado");
        res.status(400).send(false);
        return;
    }

    // Ahora hacemos la inserción de ambos id en la tabla de unión
    await Equipo_Jugador_Contrario.create({
        id_jugador: req.params.idJugadorRival, 
        id_equipo: req.params.idEquipo
    }).then((data) => {
        if(data.length != 0){
            console.log("Asociación hecha");
            res.status(200).send(true);
        }
    }).catch((err) => {
        console.log("ERROR: " + err.original.message);
        res.status(400).send(false)
    });
}

// Para crear una nueva competencia necesito obtener el id del equipo al que está asociada
// El tipo de competencia lo llenaré en base a ids mapeados manualmente
// El resto de información la obtengo del body de la petición
// Valido que el id y los campos del body no estén vacíos
// Luego valido que exista el id del equipo al que se agregará la competencia
// Luego se hace la inserción por medio del modelo de competencias
exports.createTournament = async (req, res) => {
    if(!req.params.idEquipo){
        console.log("ERROR: No puede asociar un id vacío");
        res.status(400).send(false);
        return;
    }

    // Luego validamos que los campos de la petición no estén vacíos
    if(!req.body.nombre || !req.body.fecha_inicio || !req.body.fecha_fin || !req.body.id_tipo){
        console.log("ERROR: No se puede insertar una competencia con campos vacíos");
        res.status(400).send(null);
        return;
    }

    // Ahora verificamos que el id del equipo exista en la bd
    const equipo = await Equipo.findAll({
        where: { id: req.params.idEquipo }
    });

    if(equipo.length === 0){
        console.log("Id de equipo no encontrado");
        res.status(400).send(null);
        return;
    }

    try {
        const { nombre, fecha_inicio, fecha_fin, id_tipo, activa } = req.body;
        console.log(fecha_fin);
        const nuevaCompetencia = await Competencia.create({
            activa: activa,
            fecha_fin: fecha_fin,
            fecha_inicio: fecha_inicio,
            nombre: nombre,
            id_equipo: req.params.idEquipo,
            id_tipo: id_tipo
        });
        console.log(nuevaCompetencia.fecha_fin);
        res.status(200).json(nuevaCompetencia);
    }catch (err) {
        console.error(err);
        res.status(500).send(null);
    }
}

// Para borrar una competencia validamos si los id de competencia y equipo no están vacíos
// Luego buscamos si existen ambos id en la bd
// Por último borramos el registro de la tabla competencia
exports.deleteTournament = async (req, res) => {
    if(!req.params.idEquipo || !req.params.idCompetencia){
        console.log("ERROR: No puede asociar un id vacío");
        res.status(400).send(false);
        return;
    }

    // Validamos que exista el id de equipo
    const equipo = await Equipo.findAll({
        where: { id: req.params.idEquipo }
    });

    if(equipo.length === 0){
        console.log("Id de equipo no encontrado");
        res.status(400).send(false);
        return;
    }

    // Validamos que exista el id de la competencia
    const competencia = await Competencia.findAll({
        where: { id: req.params.idCompetencia }
    })

    if(competencia.length === 0){
        console.log("Id de competencia no encontrado");
        res.status(400).send(false);
        return;
    }

    // Hacemos el borrado
    const destruidas = await Competencia.destroy({
        where: { id: req.params.idCompetencia }
    })

    if(destruidas > 0){
        res.status(200).send({
            message: "Competencia eliminada con éxito"
        });
    }else{
        console.log("ERROR: no se pudo eliminar la competencia");
        res.status(500).send(false);
        return;
    }
}