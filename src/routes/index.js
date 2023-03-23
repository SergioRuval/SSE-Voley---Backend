const { Router } = require('express');
const { db } = require("../firebase");

const router = Router();

router.get('/', async (req, res) => {
    const querySnapshot = await db.collection('Sets').get();
    
    console.log(querySnapshot.docs[0].data());
    
    res.send("API active and running");
});

module.exports = router;