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
    pib: String,
    tstamp: {
        type: Date,
        default: Date.now
    },
    offers:  [{
        type: Schema.Types.ObjectId,
        ref: 'offer'
    }],
    deleted: {
        type: Boolean,
        default: false
    }
});

ClientSchema.statics.findOffer = function (id) {
    return this.findById(id)
        .populate({
            path: 'offers',
            match: {
                deleted: false
            }
        })
        .then(client => {
            console.log(client.offers);
            return client.offers

        });
};


mongoose.model('client', ClientSchema);