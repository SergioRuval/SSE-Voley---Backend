// Para configurar express
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(morgan());

app.use(require("./routes/index"));
require("./routes/equipos.routes")(app);
require("./routes/usuarios.routes")(app);

module.exports = app;