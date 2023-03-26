const Usuario = require("../model/usuario.model");

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