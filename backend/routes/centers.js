var express = require("express");
var router = express.Router();
var Center = require("../models/center");

router.get("/", (req, res, next) => {
  Center.find()
    .select("_id name address city postal phone email hours picture")
    .exec()
    .then(centers => {
      res.send(centers);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/i=:id", (req, res, next) => {
  Center.findById(req.params.id)
    //select the propieries to show
    .select("_id name address city postal phone email hours picture")
    .exec()
    .then(centers => {
      //Validate the answer is not empty
      if (!centers) {
        return res.status(404).json({
          message: "Center id not found."
        });
      }
      res.status(201).json(centers);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Wrong center id.",
        error: err
      });
    });
});

module.exports = router;
