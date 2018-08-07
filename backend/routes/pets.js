const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload/');
  },
  filename: (req, file, cb) => {
    cb(null, filename(file.originalname));
  }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    cb(null, false);
  } else {
    cb(null, true);
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  filefilter: fileFilter
});
const localPath = "http://localhost:3000/"

const Pet = require('../models/pet');


router.post('/', upload.single('product-image'), (req, res, next) => {
  const id = new mongoose.Types.ObjectId();
  // req.file.filename = id + req.file.filename;
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
    picture: localPath + req.file.path,
    center: req.body.center,
    isDeleted: req.body.isDeleted
  })
  pet.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Handling POST request to /pets',
        createdPet: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    })
});



router.patch('/:petId', (req, res, next) => {
  const id = req.params.petId;
  const updateOps = {};
  console.log(req.body)
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Pet.update({ _id: id }, { $set: updateOps }).exec()
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




isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
};

//Create a filename randomly and keep the same extesion
filename = (filename) => {
  var ext = /\.[a-zA-Z\d]+$/;
  var crypto = require("crypto");
  var id = crypto.randomBytes(20).toString('hex');
  console.log(filename, ext.exec(filename))
  return id + ext.exec(filename);
}

module.exports = router;
