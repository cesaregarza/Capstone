const express = require("express");
const router = express.Router();
const mongoost = require("mongoose");
const multer = require("multer");
const scrypt = require("scrypt");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./upload/");
    },
    filename: (req, file, cb) => {
      cb(null, filename(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image.png") {
      cb(null, false);
    } else {
      cb(null, true);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 2
    },
    filefilter: fileFilter
  });
  
  const localPath = "https://localhost:3000/";
  
  const Userlist = require("../models/userlist");
  const User = require("../models/user");
  const Center = require("../models/center");
  
  //Set scrypt parameters
  var scryptParameters = scrypt.paramsSync(0.1);


  router.post("/", checkAuth, (req, res, next) => {

      let id = req.body.id;

      Userlist.findOneAndUpdate({
          id: id
      }, (err, user) => {
          let newPass = req.body.newPassword;
          let oldPass = req.body.oldPassword;

          if (err){
            return res.status(500).json({
                status: 500,
                message: "Server Error"
            });
          }

          if (!!newPass) {
              if (isValidPassword(user, oldPass)){
                  user.hash = scrypt.kdfSync(newPass, scryptParameters);
              } else {
                  return res.status(400).json({
                      status: 400,
                      message: "Wrong password"
                  });
              }
          }

          user.save().then(result => {
              res.status(202).json({
                  status: 202,
                  message: "Updated"
              });
          });
      });
  });


const isValidPassword = (user, password) => {
    return scrypt.verifyKdfSync(user.hash, password);
};



  module.exports = router;