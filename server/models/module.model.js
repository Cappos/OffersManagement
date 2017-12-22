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
    crdate: Date,
    groupId: [{
        type: Schema.Types.ObjectId,
        ref: 'category'
    }]
});

ModuleSchema.statics.findCategory = function (id) {
    const Category = mongoose.model('category');

    return this.findById(id._id)
        .populate('groupId' , {model: 'module'})
        .then(module => {
            Category.findById(id.groupId[0]).then(res => {
                module.groupId = res
                console.log(module);

            })

        });
}


mongoose.model('module', ModuleSchema);