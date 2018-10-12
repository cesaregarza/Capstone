var express = require("express");
var router = express.Router();
var Center = require("../models/center");
var Pet = require("../models/pet");
var Userlist = require("../models/userlist");
var Token = require("../models/tokens");

router.patch("/i=:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Center.update({ _id: id, isDeleted: false }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/id=:id", (req, res, next) => {
  Pet.find({
    center: req.params.id,
    isDeleted: false
  })
    .exec()
    .then(result => {
      res.status(200).json({
        pets: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get("/cURL=:cURL", (req, res, next) => {
  const cURL = req.params.cURL;
  Center.find({ cURL: cURL, isDeleted: false })
    .exec()
    .then(center => {
      if (!isEmpty(center)) {
        res.status(200).json({
          center: center
        });
      } else {
        res.status(204).json({
          center: "Not found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get("/?:super", (req, res, next) => {
  //Regex with lookbehind. TODO: Figure out if it works on other servers. TODO: Make this much more specific.
  // let re = /((?<=^|&)([a-zA-Z]+=[\da-zA-Z]+))/g;
  let re = /(([a-zA-Z]+=[\da-zA-Z]+))/g;


  //Match the superroute with the regex, creating groups
  let spr = req.params.super.match(re);

  //Initialize pagination variables
  let ps = 0;
  let pn = 0;

  //If no regex groups are returned, send a 500 error message saying Syntax is incorrect
  if (spr !== null) {
    //Iterate through all regex groups, setting variables to their equivalents as mentioned in the API documentation.
    for (let i = 0; i < spr.length; i++) {
      if (spr[i].split("=")[0] == "ps") {
        ps = parseInt(spr[i].split("=")[1]);
      }
      if (spr[i].split("=")[0] == "pn") {
        pn = parseInt(spr[i].split("=")[1]);
      }
    }
  }
  
  //Set defaults for ps and pn if not found
  ps = !ps ? 12 : ps;
  pn = !pn ? 1 : pn;

  //Return all centers that have not been deleted
  Center.find({
    isDeleted: false
  })
    .populate()
    //Establish a limit based on Page Size
    .limit(ps)
    //Skip first results for pagination
    .skip(ps * (pn - 1))
    .sort({ field: "asc", _id: -1 })
    .exec()
    .then(centers => {
      if (!isEmpty(centers)) {

        //Count all the centers.
        Center.countDocuments({ isDeleted: false }, (err, count) => {
         if (err) throw err;
          res.status(200).json({
            total: count,
            centers: centers
          });
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});



isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

module.exports = router;
