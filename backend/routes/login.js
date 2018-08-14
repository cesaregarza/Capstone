var express = require('express');
var router = express.Router();
var keys = require('../gitignore/keys.js');
const scrypt = require('scrypt');
const mongoose = require('mongoose');
const Userlist = require('../models/userlist');
const User = require('../models/user');
const Center = require('../models/center');
const passport = require('../middleware/passport');

const localPath = "http://localhost:3000/";

router.post('/login', passport.authenticate('local'), (req, res) => {
    let userSansHash = req.user;
    userSansHash.hash = "";

    req.session.user = userSansHash;
    res.status(200).send({
        session: req.session
    });
}
);

router.get('/login', function(req, res){
    console.log(req.session.page_views);
    console.log(req.session.user);
    if(req.session.page_views){
      req.session.page_views++;
      res.send({
          message: "You visited this page " + req.session.page_views + " times"
        });
    } else {
      req.session.page_views = 1;
      res.send({
          message: "Welcome to this page for the first time!"
      });
    }
  });

router.get('/', (req, res, next) => {
    res.status(401).json({
        error: 'Error'
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy( (err) => {
        if (err) {
            res.status(500).json({
                error: 'Could not log out'
            });
        } else {
            res.status(200).send({});
        }
    });
});

 module.exports = router;