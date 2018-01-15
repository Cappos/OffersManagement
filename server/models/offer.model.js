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
    sealer: [{
        type: Schema.Types.ObjectId,
        ref: 'sealer'
    }],
    deleted: {
        type: Boolean,
        default: false
    }
});

OfferSchema.statics.findClient = function(id) {
    return this.findById(id)
        .populate({
            path: 'client',
            match: {
                deleted: false
            }
        }).then(offer => offer.client);
};

OfferSchema.statics.findGroups = function(id) {
    return this.findById(id)
        .populate('groups')
        .then(offer => offer.groups);
};

OfferSchema.statics.findSealer = function(id) {
    return this.findById(id)
        .populate('sealer')
        .then(offer => offer.sealer);
};


OfferSchema.statics.createOffer = function (args) {
    const Offer = mongoose.model('offer');
    const Group = mongoose.model('group');
    const Client = mongoose.model('client');
    const GroupsNew = args.groups;

    return (new Offer(args)).save().then(offer => {
        Client.findOneAndUpdate({_id: args.client},
            {
                $push: {
                    offers: offer._id,
                }
            }, {new: true}).then((res) => res)

        for (let e in GroupsNew) {
            if (GroupsNew.length > 0) {
                let group = new Group({
                    name: GroupsNew[e].name,
                    subTotal: GroupsNew[e].subTotal,
                    modulesNew: GroupsNew[e].modulesNew
                });
                offer.groups.push(group);
                group.save()
            }
        }
        return Promise.all([offer.save()])
            .then(([offer]) => offer);
    });
};

mongoose.model('offer', OfferSchema);