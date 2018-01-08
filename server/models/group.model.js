const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const async = require('async');

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

GroupSchema.statics.updateGroup = function (args) {
    const Module = mongoose.model('module');

    if (args.modulesNew) {
        const ModulesNew = args.modulesNew

        for (let e in ModulesNew) {
            this.findOneAndUpdate({_id: args.id},
                {
                    $set: {
                        name: args.name,
                        subTotal: args.subTotal,
                    }
                }, {new: true})
                .then(chapter => {
                    if(ModulesNew[e].moduleNew){

                        let module = new Module({
                            name: ModulesNew[e].name,
                            bodytext: ModulesNew[e].bodytext,
                            price: ModulesNew[e].price,
                            groupId: args.id,
                            categoryId: ModulesNew[e].categoryId,
                            moduleNew: false
                        });
                        chapter.modules.push(module);
                        return Promise.all([module.save(), chapter.save()])
                            .then(([module, chapter]) => chapter);
                    }
                    else{
                        return Module.findOneAndUpdate({_id: ModulesNew[e]._id}, {
                            $set: {
                                name: ModulesNew[e].name,
                                bodytext: ModulesNew[e].bodytext,
                                price: ModulesNew[e].price,
                                groupId: ModulesNew[e].groupId,
                                categoryId: ModulesNew[e].categoryId
                            }
                        }, { new: true });

                    }

                });
        }
        return this.findById(args.id);
    }
    else {

        return this.findOneAndUpdate({_id: args.id},
            {
                $set: {
                    name: args.name,
                    subTotal: args.subTotal,
                }
            }, {new: true})
    }
};

mongoose.model('group', GroupSchema);