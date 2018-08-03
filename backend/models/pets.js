const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _uid: { type: String, required: false },
    name: { type: String, required: false },
    location: { type: Array, required: false },
    specie: { type: String, required: false },
    size: { type: String, required: false },
    age: { type: Number, required: false },
    breed: { type: String, required: false },
    description: { type: String, required: false },
    gender: { type: String, required: false },
    picture: { type: String, required: false }
});

module.exports = mongoose.model('Pet', petSchema);