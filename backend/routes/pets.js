const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const checkAuth = require("../middleware/check-auth");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
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
const localPath = "https://localhost:3000/upload/";

const Pet = require("../models/pet");
const User = require("../models/user");

router.post("/likePet", checkAuth, (req, res, next) => {
  let petId = req.body.petId;
  let userId = req.body.userId;


  Pet.findByIdAndUpdate(petId, { $push: { likes: userId } },
    (err, success) => {
          if (err) {
              console.log(err);
          } else {
              console.log(success);
          }
      });
  User.findByIdAndUpdate(userId, { $push: { liked: petId } },
    (err, success) => {
          if (err) {
              console.log(err);
          } else {
              console.log(success);
          }
      });

});

router.post("/", upload.single("petimage"), (req, res, next) => {
  const id = new mongoose.Types.ObjectId();
  // req.file.filename = id + req.file.filename;
  console.log(req.file);
  const pet = new Pet({
    _id: id,
    name: req.body.name,
    location: req.body.location,
    specie: req.body.specie,
    size: req.body.size,
    age: req.body.age,
    breed: req.body.breed,
    description: req.body.description,
    gender: req.body.gender,
    picture: localPath + req.file.filename,
    center: req.body.center,
    isDeleted: req.body.isDeleted
  });
  pet
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST request to /pets",
        createdPet: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/', (req, res, next) => {
  Pet.find().exec().then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(500).json(err);
  })
})

router.get("/id=:petId", (req, res, next) => {
  console.log(req.params.petId);
  Pet.findOne({ _id: req.params.petId, isDeleted: false })
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
router.patch("/upid=:petId", upload.single("petimage"), (req, res, next) => {
  const id = req.params.petId;
  Pet.findOne({ _id: id })
    .exec()
    .then(result => {
      fs.unlink(
        "." + result.picture.split("https://localhost:3000")[1],
        err => {
          if (err) {
            console.log("failed to delete local image:" + err);
          } else {
            console.log("successfully deleted local image");
          }
        }
      );

      Pet.update(
        { _id: id, isDeleted: false },
        { $set: { picture: localPath + req.file.filename } }
      )
        .exec()
        .then(result => {
          res.status(202).json({
            message: "ok"
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      next();
    });
});

router.patch("/id=:petId", (req, res, next) => {
  const id = req.params.petId;
  const updateOps = {};
  if (!req.file) {
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
  }
  Pet.update({ _id: id, isDeleted: false }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json(result);
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

//Create a filename randomly and keep the same extesion
filename = filename => {
  var ext = /\.[a-zA-Z\d]+$/;
  var crypto = require("crypto");
  var id = crypto.randomBytes(20).toString("hex");
  console.log(filename, ext.exec(filename));
  return id + ext.exec(filename);
};

module.exports = router;
