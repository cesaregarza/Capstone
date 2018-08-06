const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    liked: { type: Array, required: false },
    location: { type: String, required: false },
    picture: { type: String, required: true },
    date_joined: { type: Date, required: true },
    last_login  : { type: Date, required: true },
    isDeleted: { type: Boolean, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);