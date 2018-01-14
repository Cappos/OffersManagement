const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageSchema = new Schema({
    id: String,
    type: Number,
    title: String,
    subtitle: String,
    bodytext: {
        type: String,
        default: ' '
    },
    tstamp: {
        type: Date,
        default: Date.now
    },
    defaultPage: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

mongoose.model('page', PageSchema);