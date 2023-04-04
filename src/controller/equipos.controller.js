const {Equipo, Jugador_Propio ,Prueba_Fisica, Equipo_Jugador_Propio} = require("../model/Relations/relaciones.model.js");

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
                }
            ]
        });
    
        if(equipo.length === 0){
            console.log("Id de equipo no encontrado");
            res.status(400).send(null);
            return;
        }else{
            res.status(200).json(equipo[0].jugador_propios);
        }
    } catch (error) {
        console.log("ERROR: No se pudo obtener el equipo");
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

exports.delete = (req, res) => {
    console.log("Borrando un equipo");
    // Para borrar el equipo hay que hacer varias cosas
    // Primero es confirmar si el equipo existe al buscar con su id un campo en la BD
    // Luego, es eliminar todas las relaciones que tiene, que en este caso serían los partidos, jugadores
    // rivales y todo lo asociado, usando el id del equipo como referencia
    // Una forma de hacerlo sería borrando todo directamente empezando por los datos más libres de relaciones
    // y moviéndose poco a poco a aquellas relaciones que van quedando desocupadas
    // Por último habría que borrar el equipo, una vez que todo lo demás ha sido borrado
}

exports.update = (req, res) => {
    console.log("Actualizando un equipo");
    // Para actualizar un equipo hay que consultar que el equipo se encuentre en la bd
    // En caso de que no esté, regresamos un mensaje de error que la aplicación se encargará de procesar
    // Si se encuentra, se sobreescriben los datos del viejo equipo con los del nuevo equipo
    // Por último se devuelve un código de resultado exitoso por el equipo editado
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