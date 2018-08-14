const expressSession = require('express-session');
const keys = require('../gitignore/keys');
const User = require('../models/user');
const Userlist = require('../models/userlist');
const passport = require('passport');
const scrypt = require('scrypt');
var LocalStrategy = require('passport-local').Strategy;

//Create sessions as encrypted cookies. In this case, we'll just use the user ID as the session.
passport.serializeUser((user, done) => {
    done(null, user._id);
});

//Decrypt cookies to extract session information
passport.deserializeUser((id, done) => {
    Userlist.findById(id, (err, user) => {
        done(err, user);
    });
});


//Set up passport "strategy" for locally saved profiles
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    (email, password, done) => {
        Userlist.findOne({
            email: email
        }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log("wrong username");
                return done(null, false, {
                    message: 'Incorrect username.' //REMEMBER TO REMOVE THIS ON PRODUCTION
                });
            }
            let isCorrect = isValidPassword(user, password);
            if (!isCorrect) {
                console.log("wrong password");
                return done(null, false, {
                    message: 'Incorrect password.' //REMEMBER TO REMOVE THIS ON PRODUCTION
                });
            } else if (isCorrect) {
                console.log("success!");
                return done(null, user);
            }
        });
    }
));

//isValidPassword. Check if input password is valid using scrypt.
//INPUT TYPES => OUTPUT TYPES: (Object, String) => Boolean
const isValidPassword = (user, password) => {
    scrypt.paramsSync(0.1);

    return scrypt.verifyKdfSync(user.hash, password);
};

module.exports = passport;