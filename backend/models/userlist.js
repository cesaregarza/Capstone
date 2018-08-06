const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const userlistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    hash: { type: String, required: true },
    usertype: { type: Number, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    salt: { type: String, required: false },
    isDeleted: { type: Boolean, required: true }
});

userlistSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Userlist', userlistSchema);