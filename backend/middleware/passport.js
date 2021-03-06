const expressSession = require("express-session");
const keys = require("../gitignore/keys");
const User = require("../models/user");
const Userlist = require("../models/userlist");
const passport = require("passport");
const scrypt = require("scrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

//Create sessions as encrypted cookies. In this case, we'll just use the user ID as the session.
passport.serializeUser((user, done) => {
  console.log('serielize');
  done(null, user._id);
});

//Decrypt cookies to extract session information
passport.deserializeUser((id, done) => {
  console.log('deserialize');
  Userlist.findById(id, (err, user) => {
    done(err, user);
  });
});

//Set up passport "strategy" for locally saved profiles
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    (email, password, done) => {
      console.log(email);
      Userlist.findOne(
        {
          email: email,
          isDeleted: false
        },
        (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            console.log("wrong username");
            return done(null, false, {
              message: "Incorrect username." //REMEMBER TO REMOVE THIS ON PRODUCTION
            });
          }
          if (!!user.facebookid) {
            return done(null, false, {
              message: "Can't sign in"
            });
          }
          let isCorrect = isValidPassword(user, password);
          if (!isCorrect) {
            console.log("wrong password");
            return done(null, false, {
              message: "Incorrect password." //REMEMBER TO REMOVE THIS ON PRODUCTION
            });
          } else if (isCorrect) {
            console.log("success!");
            return done(null, user);
          }
        }
      );
    }
  )
);

//Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      callbackURL: "https://localhost:3000/user/auth/facebook",
      enableProof: true,
      profileFields: ["id", "displayName", "photos", "email"]
    },
    (token, refreshToken, profile, done) => {
      process.nextTick(() => {
        // console.log(profile, profile._json)
        Userlist.findOne(
          {
            facebookid: profile.id,
            isDeleted: false
          },
          (err, user) => {
            if (err) {
              return done(err);
            }
            if (!user) {
              const id = new mongoose.Types.ObjectId();
              const email = !profile.emails ? id + "@noepermission.org" : profile.emails[0].value;
              const hashedpw = Buffer.from("facebook");
              const tempUserlist = new Userlist({
                _id: id,
                name: profile.displayName,
                hash: hashedpw,
                usertype: 1,
                email: email,
                facebookid: profile.id,
                facebooktoken: token,
                date_joined: new Date(),
                last_login: new Date(),
                isDeleted: false
              });

              const tempUser = new User({
                _id: id,
                name: profile.displayName,
                email: email,
                liked: [],
                location: null,
                picture: profile.photos[0].value,
                isDeleted: false
              });

              tempUserlist
                .save()
                .then(result => {
                  tempUser.save().then(result =>{
                    return done(null, result);
                  }
                  ).catch(err => {
                    return done(err);
                  });
                })
                .catch(err => {
                  return done(err);
                });
            } else {
              return done(null, user);
            }
          }
        );
      });
    }
  )
);

//isValidPassword. Check if input password is valid using scrypt.
//INPUT TYPES => OUTPUT TYPES: (Object, String) => Boolean
const isValidPassword = (user, password) => {
  scrypt.paramsSync(0.1);

  return scrypt.verifyKdfSync(user.hash, password);
};

module.exports = passport;
