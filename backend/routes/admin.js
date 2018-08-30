var express = require("express");
var router = express.Router();
var checkAuth = require("../middleware/check-auth");
var Token = require("../models/tokens");
const mongoose = require("mongoose");

router.post("/",  (req, res, next) => {
    
  const id = new mongoose.Types.ObjectId();
  const token = new Token({
    _id: id,
    expirationDate: Date.now() + 3600000 
  });

  token.save().then(
    result => {
      res.status(201).json({ token: id });
      console.log(id);
    },
    err => {
        console.log(err);
        res.status(500).json({ error: err })
      
    }
  );
});



module.exports = router;
