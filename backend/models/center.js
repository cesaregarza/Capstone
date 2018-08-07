const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const centerSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Userlist' },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal: { type: Number, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    hours: { type: String, required: true },
    picture: { type: String, required: true },
    isDeleted: {type: Boolean, required: true }
});


centerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Center', centerSchema);