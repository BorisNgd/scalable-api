const apiRoute = require('./apis');
const public = require('./public');

const init = (server) => {
    server.use('*' , function(req , res , next){
        console.log('Request was made to:' + req.originalUrl);
        return next();
    });

    server.use('/api' , apiRoute);
    server.use('' , public)
}

module.exports = {
    init: init
};
