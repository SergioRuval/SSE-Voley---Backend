const Usuario = require("../model/usuario.model");
const Equipo = require("../model/equipo.model");
const Usuario_Equipo = require("../model/usuario_equipo.model");

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