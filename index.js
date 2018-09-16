const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = module.exports = express();
const server = http.createServer(app);
const port = parseInt(process.env.PORT || 8080);
const MongoClient = require('mongodb').MongoClient;
const {notFound, errorHandler} = require('./middlewares');
const {apiPrefix} = require('./constants');
const routes = require('./routes');

MongoClient.connect('mongodb://superuser:superuser1@ds133296.mlab.com:33296/main', { useNewUrlParser: true }, function(err, db) {
    if (err) {
        return console.log(err);
    }
    
    global.db = db.db('main');

    console.log('DB connected');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(morgan('dev'));
    app.use(cors({origin: true}));
    app.use(apiPrefix, routes);
    app.use(notFound);
    app.use(errorHandler)

    server.listen(port)
        .on('error', console.error.bind(console))
        .on('listening', console.log.bind(console, 'Listening on ' + port));  
});