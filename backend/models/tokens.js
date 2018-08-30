const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const tokenSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    expirationDate: { type: Date, required: true },
});

tokenSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Token', tokenSchema);