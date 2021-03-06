const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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
//   console.log(req.body);
  Userlist.findOne(
    {
      _id: id
    },
    (err, user) => {
    //   console.log(user);
      let newPass = req.body.newPassword;
      let oldPass = req.body.oldPassword;

      let name = req.body.name;
      let editObj = {};

      if (name !== user.name && !!name) {
        editObj.name = name;
      }

      if (err || !user) {
        return res.status(500).json({
          status: 500,
          message: "Server Error",
          error: err
        });
      }

      if (!!newPass) {
        if (isValidPassword(user, oldPass)) {
          editObj.hash = scrypt.kdfSync(newPass, scryptParameters);
          console.log("Success");
        } else {
          return res.status(400).json({
            status: 400,
            message: "Wrong password"
          });
        }
      }

      if (JSON.stringify(editObj) == JSON.stringify({})) {
        return res.status(304).json({
          status: 304,
          message: "No change",
          error: "No Change"
        });
      }

      Userlist.update({ _id: id }, { $set: editObj }, (errr, use) => {
        if (errr) {
          return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: errr
          });
        } else {
          return res.status(202).json({
            status: 202,
            message: "Updated"
          });
        }
      });
    }
  );
});

const isValidPassword = (user, password) => {
  return scrypt.verifyKdfSync(user.hash, password);
};

module.exports = router;
