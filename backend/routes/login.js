var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var keys = require('./gitignore/keys.js');
const scrypt = require('scrypt');
const mongoose = require('mongoose');
const Userlist = require('../models/userlist');
const User = require('../models/user');
const Center = require('../models/center');

//Set scrypt configs. We want keys in UTF8 and hashes in hex.
scrypt.hash.config.keyEncoding = 'utf8';
scrypt.hash.config.outputEncoding = 'hex';
scrypt.verify.config.keyEncoding = 'utf8';
scrypt.verify.config.hashEncoding = 'hex';

app.use(expressSession({
    secret: 'mySecretKey'
}));
app.use(passport.initialize());
app.use(passport.session());


//Create sessions as encrypted cookies
passport.serializeUser((user, done) => {
    done(null, user._id);
});

//Decrypt cookies to extract session
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

//Set up passport "strategy" for locally saved profiles
passport.use(new LocalStrategy(
    (username, password, done) => {
        Userlist.findOne({
            username: username
        }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.' //REMEMBER TO REMOVE THIS ON PRODUCTION
                });
            }
            if (!isValidPassword(user, password)) {
                return done(null, false, {
                    message: 'Incorrect password.' //REMEMBER TO REMOVE THIS ON PRODUCTION
                });
            }
            return done(null, user);
        });
    }
));
//isValidPassword. Check if input password is valid using scrypt.
//INPUT TYPES => OUTPUT TYPES: (Object, String) => Boolean
 const isValidPassword = (user, password) => {
    scrypt.params(0.1)
    .then( result => {
        console.log(result);
        return result;
    })
    .catch(err => {
        return err;
    });

    return scrypt.verifyKdf(user.hash, password)
    .then(result => {
        console.log(result);
        return result;
    })
    .catch(err => {
        return err;
    });
 };