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
    }],
});

GroupSchema.statics.findCategory = function (id) {
    return this.findById(id)
        .populate('modules')
        .then(group => group.modules);
};

GroupSchema.statics.updateGroup = function (id, args) {
    const Module = mongoose.model('module');

    if(args.modules){
        console.log(args.modules);
        let modules = args.modules;
    }

    return this.findOneAndUpdate({_id: id}, {
        $set: {
            name: args.name,
            subTotal: args.subTotal,
            modules: modules
        }
    }, {new: true});
};

mongoose.model('group', GroupSchema);