const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferDescriptionSchema = new Schema({
    id: String,
    offerTitle: String,
    sealer: [{
        type: Schema.Types.ObjectId,
        ref: 'sealer'
    }]
});

mongoose.model('offerDescription', OfferDescriptionSchema);