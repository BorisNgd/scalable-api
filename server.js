const server = require('./configs/app')();
//const config = require('./configs/config/config');
const db = require('./configs/db');
const functions = require('firebase-functions');
    

//create the basic server setup
server.create(db);

//start the server
server.start();

server.get('/time' , (req , res , next) =>{
    res.send('Okay');
})

exports.server = functions.https.onRequest(server); 