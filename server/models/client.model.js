const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    id: String,
    clientName: String
});

mongoose.model('client', ClientSchema);