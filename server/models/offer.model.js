const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
    id: String,
    offerNumber: String,
    bodytext: String,
    totalPrice: Number,
    tstamp: {
        type: Date,
        default: Date.now
    },
    crdate: Date,
    client: {
        type: Schema.Types.ObjectId,
        ref: 'client'
    },
    offerDescription: {
        type: Schema.Types.ObjectId,
        ref: 'offerDescription'
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'group'
    }],
    deleted: {
        type: Boolean,
        default: false
    }
});

OfferSchema.statics.findClient = function(id) {
    return this.findById(id)
        .populate('client')
        .then(offer => offer.client);
};

mongoose.model('offer', OfferSchema);