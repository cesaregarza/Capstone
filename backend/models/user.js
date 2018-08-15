const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Userlist' },
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    liked: { type: Array, required: false },
    location: { type: String, required: false },
    picture: { type: String, required: false },
    isDeleted: { type: Boolean, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);