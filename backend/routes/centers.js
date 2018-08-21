var express = require("express");
var router = express.Router();
var Center = require("../models/center");
var Userlist = require("../models/userlist");

router.patch("/i=:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Center.update({ _id: id }, { $set: updateOps })
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

router.get("/", (req, res, next) => {
  Center.find()
    .exec()
    .then(centers => {
      if (!isEmpty(centers)) {
       res.status(200).json({
         centers: centers
       }) 
      }
    })
    .catch(err => {
     res.status(500).json({
        error: err
     })
    });
});

router.get("/cURL=:cURL", (req, res, next) => {
const cURL = req.params.cURL;
  Center.find({cURL: cURL})
    .exec()
    .then(center => {
      if (!isEmpty(center)) {
       res.status(200).json({
         center: center
       }) 
      } else {
        res.status(204).json({
          center: 'Not found'
        })
      }
    })
    .catch(err => {
     res.status(500).json({
        error: err
     })
    });
});

isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

module.exports = router;
