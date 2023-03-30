const Equipo = require("../model/equipo.model");

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

exports.findByID = (req, res) => {
    console.log("Obteniendo un equipo");
    // Para encontrar por ID necesito obtener el ID de la petición req
    // Luego uso ese valor para hacer el query correspondiente SELECT * FROM equipo WHERE id = ${id}
    // Por último retorno el equipo encontrado
}

// Para crear un equipo primero hay que obtener el objeto json desde la petición req
// Este deberíamos pasarlo al modelo de datos para poder insertarlo a la BD
// Luego retornamos un resultado exitoso en caso de que se haya insertado
exports.create = async (req, res) => {
    if(!req.body.categoria || !req.body.nombre_entidad || 
        !req.body.nombre_equipo || !req.body.rama || !req.body.tipo_equipo){
            res.status(400).send({
                message: "No se puede registrar un equipo con un campo vacío"
            });
            return;
        }

    // Si no está vacía, hacemos el registro en la BD obteniendo los campos del body primero
    try {
        const { categoria, contrario, nombre_entidad, nombre_equipo, 
            rama, tipo_equipo } = req.body;
        const nuevoEquipo = await Equipo.create({
            categoria: categoria,
            contrario: contrario,
            nombre_entidad: nombre_entidad,
            nombre_equipo: nombre_equipo,
            rama: rama,
            tipo_equipo: tipo_equipo
        });
        res.status(200).json(nuevoEquipo);
    }catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Hubo un error inesperado al crear al equipo"
        });
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