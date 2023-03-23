const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "ssevolley"
});

conexion.connect((err) => {
    if(err) throw err;
    console.log("Connected to mysql");
});

module.exports = conexion;