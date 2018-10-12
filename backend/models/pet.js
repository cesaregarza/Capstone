const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    location: { type: String, required: true },
    specie: { type: String, required: true },
    size: { type: String, required: false },
    age: { type: String, required: true },
    breed: { type: String, required: false },
    description: { type: String, required: false },
    gender: { type: String, required: true },
    picture: { type: String, required: true },
    likes: {type: Array, requiered: false },
    center: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
    isDeleted: { type: Boolean, required: true }
});

module.exports = mongoose.model('Pet', petSchema);