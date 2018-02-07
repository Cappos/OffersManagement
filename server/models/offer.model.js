const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
        id: String,
        offerNumber: String,
        offerTitle: String,
        bodytext: String,
        totalPrice: Number,
        tstamp: {
            type: Date,
            default: Date.now
        },
        expDate: Date,
        signed: {
            type: Boolean,
            default: false
        },
        client: [{
            type: Schema.Types.ObjectId,
            ref: 'client'
        }],
        groups: [{
            type: Schema.Types.ObjectId,
            ref: 'group'
        }],
        pages: [{
            type: Schema.Types.ObjectId,
            ref: 'page'
        }],
        files: Array,
        sealer: [{
            type: Schema.Types.ObjectId,
            ref: 'sealer'
        }],
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        usePushEach: true
    });

OfferSchema.statics.findClient = function (id) {

    return this.findById(id)
        .populate({
            path: 'client',
            match: {
                deleted: false
            }
        }).then(offer => offer.client);
};

OfferSchema.statics.findGroups = function (id) {
    return this.findById(id)
        .populate({
            path: 'groups',
            match: {
                deleted: false
            }
        })
        .then(offer => offer.groups);
};

OfferSchema.statics.findPages = function (id) {
    return this.findById(id)
        .populate({
            path: 'pages',
            match: {
                deleted: false
            }
        })
        .then(offer => offer.pages);
};

OfferSchema.statics.findSealer = function (id) {
    return this.findById(id)
        .populate('sealer')
        .then(offer => offer.sealer);
};


OfferSchema.statics.createOffer = function (args) {
    const Offer = mongoose.model('offer');
    const Group = mongoose.model('group');
    const Client = mongoose.model('client');
    const Module = mongoose.model('module');
    const Page = mongoose.model('page');
    const GroupsNew = args.groupsNew;

    return this.count().then((count) => {
        args.offerNumber = '00' + count + 1 + '/' + new Date().getFullYear();

        return (new Offer(args)).save().then(offer => {
            Client.findOneAndUpdate({_id: args.client},
                {
                    $push: {
                        offers: offer._id,
                    }
                }, {new: true}).then((res) => res);

            for (let e in GroupsNew) {
                if (GroupsNew.length > 0) {
                    // create new group
                    if (GroupsNew[e].type === 1) {
                        let group = new Group({
                            name: GroupsNew[e].name,
                            subTotal: GroupsNew[e].subTotal,
                            order: GroupsNew[e].order
                        });
                        group.save().then((res) => {
                            for (let m in GroupsNew[e].modules) {
                                if (GroupsNew[e].modules[m].moduleNew) {
                                    // create new modules form modules array
                                    let module = new Module({
                                        name: GroupsNew[e].modules[m].name,
                                        bodytext: GroupsNew[e].modules[m].bodytext,
                                        price: GroupsNew[e].modules[m].price,
                                        groupId: group._id,
                                        categoryId: GroupsNew[e].modules[m].categoryId,
                                        moduleNew: false
                                    });
                                    module.save();
                                    res.modules.push(module);
                                }
                            }
                            res.save()
                        });
                        offer.groups.push(group);
                    }
                    // create new page from pages array
                    else if (GroupsNew[e].type === 2) {
                        let page = new Page({
                            type: GroupsNew[e].type,
                            title: GroupsNew[e].title,
                            subtitle: GroupsNew[e].subtitle,
                            bodytext: GroupsNew[e].bodytext,
                            defaultPage: false,
                            order: GroupsNew[e].order
                        });
                        page.save().then((res) => res);
                        offer.pages.push(page);
                    }
                }
            }
            return Promise.all([offer.save()])
                .then(([offer]) => offer);
        });
    });
};


OfferSchema.statics.updateOffer = function (args) {
    const Group = mongoose.model('group');
    const Client = mongoose.model('client');
    const Module = mongoose.model('module');
    const Page = mongoose.model('page');
    const GroupsNew = args.groupsNew;

        // Unset offer client
        Client.findOneAndUpdate({_id: args.oldClient},
            {
                $unset: {
                    offers: args._id,
                }
            }, {new: true}).then((res) => res);

        return this.findOneAndUpdate({_id: args.id},
            {
                $set: {
                    offerNumber: args.offerNumber,
                    offerTitle: args.offerTitle,
                    totalPrice: args.totalPrice,
                    bodytext: args.bodytext,
                    client: args.client,
                    sealer: args.sealer,
                    expDate: args.expDate,
                    signed: args.signed
                }
            }, {new: true}).then(offer => {

            // Set new offer client
            Client.findOneAndUpdate({_id: args.client},
                {
                    $addToSet: {
                        offers: offer._id,
                    }
                }, {new: true}).then((res) => res);

            for (let e in GroupsNew) {
                if (GroupsNew.length > 0) {

                    if (GroupsNew[e].type === 1) {
                        // create new group
                        if (GroupsNew[e].groupNew) {
                            let group = new Group({
                                name: GroupsNew[e].name,
                                subTotal: GroupsNew[e].subTotal,
                                order: GroupsNew[e].order
                            });
                            group.save().then((res) => {
                                for (let m in GroupsNew[e].modules) {
                                    if (GroupsNew[e].modules[m].moduleNew) {
                                        // create new modules form modules array
                                        let module = new Module({
                                            name: GroupsNew[e].modules[m].name,
                                            bodytext: GroupsNew[e].modules[m].bodytext,
                                            price: GroupsNew[e].modules[m].price,
                                            groupId: group._id,
                                            categoryId: GroupsNew[e].modules[m].categoryId[0]._id,
                                            moduleNew: false
                                        });
                                        module.save();
                                        res.modules.push(module);
                                    }
                                }
                                res.save()
                            });
                            offer.groups.push(group);
                        }
                        else {
                            Group.findOneAndUpdate({_id: GroupsNew[e]._id},
                                {
                                    $set: {
                                        name: GroupsNew[e].name,
                                        subTotal: GroupsNew[e].subTotal,
                                        order: GroupsNew[e].order,
                                        deleted: GroupsNew[e].deleted
                                    }
                                }, {new: true}).then((res) => {
                                for (let m in GroupsNew[e].modules) {
                                    if (GroupsNew[e].modules[m].moduleNew) {
                                        // create new modules form modules array
                                        let module = new Module({
                                            name: GroupsNew[e].modules[m].name,
                                            bodytext: GroupsNew[e].modules[m].bodytext,
                                            price: GroupsNew[e].modules[m].price,
                                            groupId: res._id,
                                            categoryId: GroupsNew[e].modules[m].categoryId[0]._id,
                                            moduleNew: false
                                        });
                                        module.save();
                                        res.modules.push(module);
                                    }
                                    else {
                                        Module.findOneAndUpdate({_id: GroupsNew[e].modules[m]._id},
                                            {
                                                $set: {
                                                    name: GroupsNew[e].modules[m].name,
                                                    bodytext: GroupsNew[e].modules[m].bodytext,
                                                    price: GroupsNew[e].modules[m].price,
                                                    groupId: res._id,
                                                    categoryId: GroupsNew[e].modules[m].categoryId[0]._id,
                                                    moduleNew: false,
                                                    deleted: GroupsNew[e].modules[m].deleted
                                                }
                                            }, {new: true}).then((res) => res);
                                    }
                                }
                                res.save()
                            });
                        }

                    }
                    // create new page from pages array
                    else if (GroupsNew[e].type === 2) {

                        if (GroupsNew[e].pageNew) {
                            let page = new Page({
                                type: GroupsNew[e].type,
                                title: GroupsNew[e].title,
                                subtitle: GroupsNew[e].subtitle,
                                bodytext: GroupsNew[e].bodytext,
                                defaultPage: false,
                                order: GroupsNew[e].order
                            });
                            page.save().then((res) => res);
                            offer.pages.push(page);
                        }
                        else {
                            Page.findOneAndUpdate({_id: GroupsNew[e]._id},
                                {
                                    $set: {
                                        type: GroupsNew[e].type,
                                        title: GroupsNew[e].title,
                                        subtitle: GroupsNew[e].subtitle,
                                        bodytext: GroupsNew[e].bodytext,
                                        defaultPage: false,
                                        order: GroupsNew[e].order,
                                        deleted: GroupsNew[e].deleted
                                    }
                                }, {new: true}).then((res) => res);
                        }
                    }
                }
            }
            return Promise.all([offer.save()])
                .then(([offer]) => offer);
        });
};


mongoose.model('offer', OfferSchema);