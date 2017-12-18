const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
    id: String,
    name: String,
    bodytext: String,
    price: Number,
    tstamp: {
        type: Date,
        default: Date.now
    },
    cruserId: Number,
    crdate:  Date
});

mongoose.model('module', ModuleSchema);