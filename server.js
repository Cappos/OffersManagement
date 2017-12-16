const express = require('express');
const models = require('./server/models');
const expressGraphQL = require('express-graphql');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
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

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));


module.exports = app;