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
        .populate('groups')
        .then(offer => offer.groups);
};
OfferSchema.statics.findPages = function (id) {
    return this.findById(id)
        .populate('pages')
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
    const Module = mongoose.model('module')
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
                                    module.save()
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
                        page.save().then((res) => res)
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
    console.log(args);
};


mongoose.model('offer', OfferSchema);