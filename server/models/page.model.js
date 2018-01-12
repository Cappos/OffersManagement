const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageSchema = new Schema({
    id: String,
    type: Number,
    title: String,
    subtitle: String,
    bodytext: String,
    tstamp: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('page', PageSchema);