var express = require('express');
var router = express.Router();
var keys = require('../gitignore/keys.js');
const scrypt = require('scrypt');
const mongoose = require('mongoose');
const Userlist = require('../models/userlist');
const User = require('../models/user');
const Center = require('../models/center');
const passport = require('../middleware/passport');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');


const localPath = "https://localhost:3000/";

router.post('/login', passport.authenticate('local'), (req, res) => {
    let userSansHash = req.user;
    userSansHash.hash = "";

    req.session.user = userSansHash;
    const token = jwt.sign({email: req.user.email, userId: req.user.u_id}, keys.JWT_KEY, 
    { expiresIn: '20m' } 
) ;

    res.status(200).json({
        token: token,
        user: req.session
    });
}
);

//Route to initiate login
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email']
}));

//Callback route on successful login via facebook
router.get('/auth/facebook', passport.authenticate('facebook'), (req, res) => {
    let userSansHash = req.user;
    userSansHash.hash = "";

    req.session.user = userSansHash;
    const token = jwt.sign({email: req.user.email, userId: req.user.u_id}, keys.JWT_KEY, {expiresIn: '20m'});

    res.status(200).json({
        token: token,
        user: req.session
    })
});

router.get('/login', checkAuth, function(req, res){
      
    if (req.session.user) {
        res.status(200).json({
              user: req.session.user
            });
    } else {
    res.status(401).json({
        error: "Auth error"
    })
}
    
  });

router.get('/', (req, res, next) => {
    res.status(401).json({
        error: 'Hola'
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy( (err) => {
        if (err) {
            res.status(500).json({
                error: 'Could not log out'
            });
        } else {
            console.log(req.sessionID)
            res.status(200).json({});
        }
    });
});

 module.exports = router;