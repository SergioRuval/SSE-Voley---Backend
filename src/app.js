// Para configurar express
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(morgan());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./routes/index"));
require("./routes/equipos.routes")(app);
require("./routes/usuarios.routes")(app);
require("./routes/jugadores.routes")(app);

module.exports = app;