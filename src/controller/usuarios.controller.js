const {Usuario, Equipo, Jugador_Propio ,Prueba_Fisica, 
    Equipo_Jugador_Propio, Usuario_Equipo, Competencia, 
    Jugador_Contrario, Equipo_Jugador_Contrario} = require("../model/Relations/relaciones.model.js");

exports.findAll = async (req, res) => {
    await Usuario.findAll().then((data) => {
        res.status(200).json(data); 
    }).catch((err) => {
        throw err;
    });
}

exports.findOneUser = async (req, res) => {
    // Hacemos la búsqueda del usuario usando la contraseña y el nombre de usuario
    await Usuario.findAll(
        {
            where: {
                username: "sergio.ruvalcab",
                password: "hola1234"
            }
        }
    ).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        throw err;
    })
}

exports.findById = async (req, res) => {

}

exports.register = async (req, res) => {
    // Primero validamos que la petición no esté vacía.
    if(!req.body.nombre || !req.body.apellidos || !req.body.username
        || !req.body.rol || !req.body.password){
            res.status(400).send({
                message: "No se puede registrar un usuario con un campo vacío"
            });
            return;
        }

    // Si no está vacía, hacemos el registro en la BD obteniendo los campos del body primero
    try {
        const { nombre, apellidos, username, rol, password } = req.body;
        const nuevoUsuario = await Usuario.create({
            nombre: nombre,
            apellidos: apellidos,
            password: password,
            rol: rol,
            username: username
        });
        res.status(200).json(nuevoUsuario);
    }catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Hubo un error inesperado al crear al usuario"
        });
    }
}

exports.login = async (req, res) => {
    if(!req.body.username || !req.body.password){
        res.status(400).send({
            message: "Credenciales vacías"
        });
        return;
    }

    let user = req.body.username;
    let password = req.body.password;

    let usuariosEncontrados = 0;

    // Hacemos la búsqueda del usuario usando la contraseña y el nombre de usuario y obtenemos el conteo
    await Usuario.count(
        {
            where: {
                username: user,
                password: password
            }
        }
    ).then((data) => {
        usuariosEncontrados = data;
    }).catch((err) => {
        throw err;
    });

    // Si el conteo de usuarios es 0, entonces las credenciales no son válidas y se envía una cadena vacía
    // Si es diferente de 1, entonces las credenciales son válidas y se retorna el usuario enontrado
    if(usuariosEncontrados == 0){
        res.status(200).send("");
    }else{
        await Usuario.findAll(
            {
                where: {
                    username: user,
                    password: password
                }
            }
        ).then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            throw err;
        });
    }
}

// Para asociar un equipo a un usuario necesitamos del id tanto del equipo como del usuario
// Una vez recibidos, es necesario validar si ambos id existen en sus respectivas tablas
// Tras hacer la validación hacemos una inserción de ambos id en la tabla correspondiente
exports.asociateTeam = async (req, res) => {
    if(!req.params.idEquipo || !req.params.idUsuario){
        console.log("Ids vacíos");
        res.status(400).send(false);
        return;
    }

    // Validamos que exista el usuario
    const usuario = await Usuario.findAll({
        where: { id: req.params.idUsuario }
    });

    if(usuario.length === 0){
        console.log("Id de usuario no encontrado");
        res.status(400).send(false);
        return;
    }

    // Validamos que exista el equipo
    const equipo = await Equipo.findAll({
        where: { id: req.params.idEquipo }
    });

    if(equipo.length === 0){
        console.log("Id de equipo no encontrado");
        res.status(400).send(false);
        return;
    }

    await Usuario_Equipo.create({
        id_equipo: req.params.idEquipo,
        id_usuario: req.params.idUsuario
    }).then((data) => {
        if(data.length != 0){
            console.log("Asociación hecha");
            res.status(200).send(true);
        }
    }).catch((err) => {
        console.log("ERROR:" + err.original.message);
        res.status(400).send(false)
    });
}

// Para encontrar equipos por usuario hay que obtener el id del usuario desde los parámetros de la ruta
// Luego usar ese id para hacer la búsqueda usando el modelo usuario_equipo
// El modelo retornará el usuario y un array de equipos, por lo que sólo es necesario retornar el array
// de equipos
// Hay que filtrar los equipos por aquellos que no sean rivales
exports.findTeams = async (req, res) => {
    // Checamos que el id no esté vacío
    if(!req.params.idUsuario){
        console.log("Id vacío");
        res.status(400).send(false);
        return;
    }

    // Ahora revisamos que el id de usuario sea válido
    const usuario = await Usuario.findAll({
        where: { id: req.params.idUsuario }
    });

    if(usuario.length === 0){
        console.log("Id de usuario no encontrado");
        res.status(400).send(false);
        return;
    }

    // Por último, si pasa las validaciones, hacemos la búsqueda de los equipos
    await Usuario.findAll({
        where: { id: req.params.idUsuario },
        include: {
            model: Equipo,
            through: {
                model: Usuario_Equipo,
            },
            where: { contrario: false },
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
        }
    }).then((data) => {
        if(data.length != 0){
            console.log("Equipos encontrados");
            res.status(200).json(data[0].equipos);
        }else{
            console.log("No hay equipos para el usuario");
            res.status(400).json([]);
            return;
        }
    }).catch((err) => {
        console.log("ERROR:" + err.message);
        res.status(400).send(false)
    });;
}

exports.findRivalTeams = async (req, res) => {
    // Checamos que el id no esté vacío
    if(!req.params.idUsuario){
        console.log("Id vacío");
        res.status(400).send(false);
        return;
    }

    // Ahora revisamos que el id de usuario sea válido
    const usuario = await Usuario.findAll({
        where: { id: req.params.idUsuario }
    });

    if(usuario.length === 0){
        console.log("Id de usuario no encontrado");
        res.status(400).send(false);
        return;
    }

    // Por último, si pasa las validaciones, hacemos la búsqueda de los equipos
    await Usuario.findAll({
        where: { id: req.params.idUsuario },
        include: {
            model: Equipo,
            through: {
                model: Usuario_Equipo,
            },
            where: { contrario: true },
            include: [
                {
                    model: Jugador_Contrario,
                    through: { model: Equipo_Jugador_Contrario }
                }
            ]
        }
    }).then((data) => {
        if(data.length != 0){
            console.log("Equipos encontrados");
            res.status(200).json(data[0].equipos);
        }else{
            console.log("No hay equipos para el usuario");
            res.status(400).json([]);
            return;
        }
    }).catch((err) => {
        console.log("ERROR:" + err.message);
        res.status(400).send(false)
    });;
}