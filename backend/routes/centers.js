var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Center = require('../models/center');

router.get('/', (req, res, next) => {
  Center.find()
      .exec()
      .then(users => {
          res.send(users);
      })
      .catch(err => {
          res.status(500).json(err);
      });
});

reqAuth = () => {

}
router.post("/", (req, res, next) => {
  const center = new Center({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    postal: req.body.postal,
    phone: req.body.phone,
    email: req.body.email,
    hours: req.body.hours,
    picture: req.body.picture,
    isDeleted: req.body.isDeleted
});

center.save()
.then(result => {
  console.log(result);
  res.status(201).json(result)
})
.catch(err => {
  res.status(500).json({
    error: err
  });
});
});

module.exports = router;
