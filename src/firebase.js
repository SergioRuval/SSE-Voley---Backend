// Para conectarnos con firebase
require('dotenv').config()

const { initializeApp, applicationDefault } = require('firebase-admin/app');

const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
    credential: applicationDefault()
});

// Objeto de la bd que nos permite operar con ella
const db = getFirestore();

module.exports = {
    db
};