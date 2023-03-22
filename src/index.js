// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// var serviceAccount = require("../sse-voley-firebase-adminsdk-wapnv-bd9b58746e.json");

// initializeApp({
//   credential: cert(serviceAccount)
// });

// const db = getFirestore();

// const documentReference = db.collection('users').doc('alovelace');

// await documentReference.set({
//   first: 'Ada',
//   last: 'lovelace',
//   born: 1815
// });

const app = require('./app');

require('./firebase');

app.listen(3000);
console.log('Server is running on port 3000');