const express = require('express');
const models = require('./server/models');
const expressGraphQL = require('express-graphql');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const schema = require('./server/schema/schema');

const app = express();

// Replace with your mongoLab URI
const MONGO_URI = 'mongodb://127.0.0.1:27017/offers-management';
if (!MONGO_URI) {
    throw new Error('You must provide a MongoLab URI');
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
    .once('open', () => console.log('Connected to MongoDB instance.'))
    .on('error', error => console.log('Error connecting to MongoDB:', error));


mongoose.set('debug', false);
// Handling file upload
const conn = mongoose.connection;
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
const gfs = Grid(conn.db);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(__dirname + '/'));


// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});


// File upload
const storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        let datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    },
});

const upload = multer({ //multer settings for single upload
    storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }

        res.send(req.file);
    });
});


//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));


module.exports = app;