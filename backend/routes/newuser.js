const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Userlist = require('../models/userlist');
const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});


router.post('/', (req, res, next) => {
    const id = new mongoose.Types.ObjectId();
    const userlist = new Userlist({
        _id: id,
        hash: req.body.hash,
        usertype: req.body.usertype,
        username: req.body.username,
        email: req.body.email,
        salt: req.body.salt,
        isDeleted: req.body.isDeleted
    });
    const user = new User({
        _id: id,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        liked: req.body.liked,
        location: req.body.location,
        picture: req.body.picture,
        date_joined: req.body.date_joined,
        last_login: req.body.last_login,
        isDeleted: req.body.isDeleted
    });

    userlist.save()
        .then(result => {
            console.log(result);
            // *** we can't sent response 2 times in the same router ***
            // res.status(201).json({
            //     message: 'The userlist was successfully created.',
            //     createdUser: result
            // });
        })
        .catch(err => {
            console.log(err);
            // res.status(500).json({
            //     error: err
            // });
        });

    user.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'The user was successfully created.',
                createdUser: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


// getUseslist = () => {
//     Userlist.find()
//     .exec()
//     .then(users => {
//     return users
//         // res.status(200).json(users);
//     })
//     .catch(err => {
//         console.log(err);
//         // res.status(500).json(err);
//     });

// }



module.exports = router;