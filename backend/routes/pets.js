const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pet = require('../models/pet');


router.post('/', (req, res, next) => {
  const  pet = new Pet({
    _id: new mongoose.Types.ObjectId(),
    _uid: req.body._uid,
    name: req.body.name,
    location: req.body.location,
    specie: req.body.specie,
    size: req.body.size,
    age: req.body.age,
    breed: req.body.breed,
    description: req.body.description,
    gender: req.body.gender,
    picture: req.body.picture,
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

module.exports = router;
