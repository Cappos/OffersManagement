const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    publishedDate: {
        type: Date,
        default: Date.now
    },
    keywords: Array,
    published: Boolean,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    detail: {
        modelNumber: Number,
        hardcover: Boolean,
        reviews: Number,
        rank: Number
    }
});

module.exports = mongoose.model('Book', BookSchema);