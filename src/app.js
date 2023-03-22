// Para configurar express
const express = require("express");
const morgan = require("morgan");

const { db } = require("./firebase");

const app = express();

app.use(morgan());

app.get('/', async (req, res) => {
    const querySnapshot = await db.collection('Sets').get();
    
    console.log(querySnapshot.docs[0].data());
    
    res.send("Hello");
});

module.exports = app;