const mongoose = require('mongoose')

const centerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, require: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    hours: { type: String, required: true },
    picture: { type: String, required: true }
});

module.exports = mongoose.model('Product', centerSchema);