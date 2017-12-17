const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SealerSchema = new Schema({
    id: String,
    name: String,
    email: String,
    phone: String,
    mobile: String,
    value: Number,
    active: {
        type: Schema.Types.ObjectId,
        ref: 'offer'
    }
});

mongoose.model('sealer', SealerSchema);