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
  Userlist.find({usertype: 2})
    .exec()
    .then(centers => {
      console.log(centers,!isEmpty(centers))
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

isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

module.exports = router;
