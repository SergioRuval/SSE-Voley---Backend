const Usuario = require("../model/usuario.model");

exports.findAll = async (req, res) => {
    await Usuario.findAll().then((data) => {
        res.status(200).json(data); 
    }).catch((err) => {
        throw err;
    });
}

exports.findById = async (req, res) => {

}

exports.login = async (req, res) => {
    
}