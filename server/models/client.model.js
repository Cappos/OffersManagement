const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    id: String,
    contactPerson: String,
    companyName: String,
    address: String,
    contactPhone: String,
    mobile: String,
    mail: String,
    webSite: String,
    pib: Number,
    tstamp: {
        type: Date,
        default: Date.now
    },
    offers:  [{
        type: Schema.Types.ObjectId,
        ref: 'offer'
    }]
});

ClientSchema.statics.findOffer = function (id) {
    return this.findById(id)
        .populate('offers')
        .then(client => client.offers);
};


mongoose.model('client', ClientSchema);