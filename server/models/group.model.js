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
        const modules = [];
        let itemsProcessed = 0;

        for (let e in ModulesNew) {
            itemsProcessed++;
            let module = new Module({
                name: ModulesNew[e].name,
                bodytext: ModulesNew[e].bodytext,
                price: ModulesNew[e].price,
                groupId: args.id,
                categoryId: ModulesNew[e].categoryId,
                moduleNew: false
            });

            module.save()
            modules.push(module);
            if (itemsProcessed === ModulesNew.length) {
                callback(args, modules);
            }
        }


        // async.each(ModulesNew, function (e) {
        //
        //         const module = new Module({
        //             name: e.name,
        //             bodytext: e.bodytext,
        //             price: e.price,
        //             groupId: args.id,
        //             categoryId: e.categoryId,
        //             moduleNew: false
        //         }).save().then(module => {
        //             modules.push(module)
        //
        //         });
        //
        //     }
        // )
    }

    function callback(data, modulesID) {
        console.log('callback',modulesID);
        console.log(data, 'data');
        return this.findOneAndUpdate({_id: data.id}, {
            $set: {
                name: data.name,
                subTotal: data.subTotal,
                modules: modulesID
            }
        }, {new: true});
    }
};

mongoose.model('group', GroupSchema);