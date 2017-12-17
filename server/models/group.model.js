const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    id: String,
    name: String,
    bodytext: String,
    subTotal: Number,
    tstamp: {
        type: Date,
        default: Date.now
    },
    cruserId: Number,
    crdate: Date,
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'module'
    }]
});

mongoose.model('group', GroupSchema);