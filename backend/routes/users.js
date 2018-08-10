var express = require('express');
var router = express.Router();

const User = require('../models/user')

router.patch('/i=:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    console.log(req.body)
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: id }, { $set: updateOps }).exec()
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
module.exports = router;
