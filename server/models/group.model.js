const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    id: String,
    name: String,
    subTotal: Number,
    tstamp: {
        type: Date,
        default: Date.now
    },
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'module'
    }]
});

GroupSchema.statics.findCategory = function (id) {
    return this.findById(id)
        .populate('modules')
        .then(group => group.modules);
};

mongoose.model('group', GroupSchema);