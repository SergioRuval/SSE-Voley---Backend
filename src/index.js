const app = require('./app');

const sequelize = require("./mysql");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  try{
    sequelize.authenticate();
    console.log("Connection to mysl established");
  }catch(error){
    console.error("no se pudo conectar", error);
  }

});