const mysql = require("../mysql");

exports.findAll = (req, res) => {
    console.log("Obteniendo todos los equipos");
    // Para obtener los equipos hay que simplemente hacer la búsqueda en la BD
    // El detalle sería obtener los equipos contrarios, ya que estos tienen un campo adicional a validar
    // Para esto puedo crear dos endpoints diferentes, uno para los equipos propios y uno para los contrarios
    // y así separar la lógica de ambos
    mysql.query("SELECT * FROM equipo", (err, data, fields) => {
        if(err) throw err
        res.status(200).json(data)
    });
}

exports.findByID = (req, res) => {
    console.log("Obteniendo un equipo");
    // Para encontrar por ID necesito obtener el ID de la petición req
    // Luego uso ese valor para hacer el query correspondiente SELECT * FROM equipo WHERE id = ${id}
    // Por último retorno el equipo encontrado
}

exports.create = (req, res) => {
    console.log("Creando un equipo");
    // Para crear un equipo primero hay que obtener el objeto json desde la petición req
    // Este deberíamos pasarlo al modelo de datos para poder insertarlo a la BD
    // Luego retornamos un resultado exitoso en caso de que se haya insertado
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