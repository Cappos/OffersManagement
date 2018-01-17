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
const MONGO_URI = 'mongodb://cappors:testertester@ds059546.mlab.com:59546/offers-management';
if (!MONGO_URI) {
    throw new Error('You must provide a MongoLab URI');
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

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


// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// File upload
//** Setting up storage using multer-gridfs-storage */
const storage = GridFsStorage({
    url: MONGO_URI,
    gfs : gfs,
    filename: function (req, file, cb) {
        const datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    },
    /** With gridfs we can store aditional meta-data along with the file */
    metadata: function(req, file, cb) {
        cb(null, { originalname: file.originalname });
    },
    root: 'ctFiles' //root name for collection to store files into
});

const upload = multer({ //multer settings for single upload
    storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        // console.log(res);
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        res.json({error_code:0,err_desc:null});
        let writestream = gfs.createWriteStream(res.file);
        // fs.createReadStream('./dist/upload').pipe(writestream);
        writestream.on('close', function (file) {
            // do something with `file`
            console.log(file.filename);
        });

    });
});

app.get('/file/:filename', function(req, res){
    console.log(res);
    gfs.collection('ctFiles'); //set collection name to lookup into

    /** First check if file exists */
    gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
        if(!files || files.length === 0){
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        /** create read stream */
        const readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "ctFiles"
        });
        /** set the proper content type */
        res.set('Content-Type', files[0].contentType)
        /** return response */
        return readstream.pipe(res);
    });
});


//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));


module.exports = app;