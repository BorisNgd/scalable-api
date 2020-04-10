const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

module.exports = function(){
    let server = express(),
    create,
    start;

    create = (config , db) =>{
        let routes = require('../routes');
        //set all the server things
        //server.set('env' , config.env);
        server.set('port' , config.port);
        server.set('hostname' , config.hostname);

        //add middleware to parse json
        server.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
        server.use(cors())
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({
            extended:false
        }));

    
        //connect the database
        mongoose.connect(
            db.database,{
                useNewUrlParser:true,
                useCreateIndex:true
            }
        );

        //set up routes
        routes.init(server);
    };


    start = () =>{
        let hostname = server.get('hostname'),
        port = server.get('port');
        server.listen(port , function(){
            console.log('Express server listening on - http://'+hostname+':'+port, '');
            console.log('ENVIRONMENT :', server.get('env'));
        });
    };

    return{
        create: create,
        start: start
    };
};