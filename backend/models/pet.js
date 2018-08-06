const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _uid: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    specie: { type: String, required: true },
    size: { type: String, required: false },
    age: { type: Number, required: true },
    breed: { type: String, required: false },
    description: { type: String, required: false },
    gender: { type: String, required: true },
    picture: { type: String, required: true },
    isDeleted: { type: Boolean, required: true }
});

module.exports = mongoose.model('Pet', petSchema);