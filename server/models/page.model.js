const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageSchema = new Schema({
    id: String,
    type: {
        type: Number,
        default: 2
    },
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
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

mongoose.model('page', PageSchema);