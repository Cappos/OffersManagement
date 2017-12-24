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
ModuleSchema.statics.addCategory = function(name, bodytext, price, tstmp,  groupId) {
    const Category = mongoose.model('category');

    return this.findById(id)
        .then(module => {
            const category = new Category({ content, module });
            module.groupId.push(category);
            return Promise.all([category.save(), module.save()])
                .then(([groupId, module]) => module);
        });
}
// ModuleSchema.statics.addCategory = function(id, content) {
//     const Category = mongoose.model('category');
//
//     return this.findById(id)
//         .then(module => {
//             const category = new Category({ content, module });
//             module.groupId.push(category);
//             return Promise.all([category.save(), module.save()])
//                 .then(([groupId, module]) => module);
//         });
// }



ModuleSchema.statics.findCategory = function (id) {
    return this.findById(id)
        .populate('groupId')
        .then(module => module.groupId);
};

mongoose.model('module', ModuleSchema);