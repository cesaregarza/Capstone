const expressSession = require('express-session');
const keys = require('../gitignore/keys');
const User = require('../models/user');
const Userlist = require('../models/userlist');
const passport = require('passport');
const scrypt = require('scrypt');
const mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


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
            if (!!user.facebookid){
                return done(null, false, {
                    message: "Can't sign in"
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

//Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: 'https://localhost:3000/user/auth/facebook',
    enableProof: true,
    usernameField: 'email',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, (token, refreshToken, profile, done) => {
    process.nextTick( () => {
        console.log(profile);
        Userlist.findOne({
            facebookid: profile.id
        }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                const id = new mongoose.Types.ObjectId();
                const hashedpw = Buffer.from("facebook");

                const tempUserlist = new Userlist({
                    _id: id,
                    hash: hashedpw,
                    usertype: 1,
                    email: profile.emails[0].value,
                    facebookid: profile.id,
                    facebooktoken: token,
                    date_joined: new Date(),
                    last_login: new Date(),
                    isDeleted: false
                });

                const tempUser = new User({
                    _id: id,
                    name: profile.name.givenName,
                    email: profile.emails[0].value,
                    liked: [],
                    location: null,
                    picture: profile.photos[0].value,
                    isDeleted: false
                });
                
                tempUserlist.save().then(result => {
                    tempUser.save()
                        .catch(err => {
                            return done(err);
                        });
                })
                .catch(err => {
                    return done(err);
                });
            } else {
                return done(null, user);
            }
        });
    });
}));

//isValidPassword. Check if input password is valid using scrypt.
//INPUT TYPES => OUTPUT TYPES: (Object, String) => Boolean
const isValidPassword = (user, password) => {
    scrypt.paramsSync(0.1);

    return scrypt.verifyKdfSync(user.hash, password);
};

module.exports = passport;