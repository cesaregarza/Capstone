var express = require("express");
var router = express.Router();
var checkAuth = require("../middleware/check-auth");
var Token = require("../models/tokens");
const mongoose = require("mongoose");

var ip2loc = require("ip2location-nodejs");

router.get("/:ip", (req, res, next) => {
 
ip2loc.IP2Location_init("./IP-COUNTRY-REGION-CITY-SAMPLE.BIN");
 
testip = [req.params.ip];
for (var x = 0; x < testip.length; x++) {
    result = ip2loc.IP2Location_get_all(testip[x]);
    for (var key in result) {
        console.log(key + ": " + result[key]);
    }
}
})

router.post("/",  (req, res, next) => {
    
  const id = new mongoose.Types.ObjectId();
  const token = new Token({
    _id: id,
    expirationDate: Date.now() + 64800000 
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
