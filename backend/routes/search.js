const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Pet = require('../models/pets');

router.get('/', (req, res, next) => {
  const location = req.params.location;
  Pet.find()
  .exec()
  .then(pets => {
    console.log(pets);
    res.status(200).json(pets);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.get('/l=:location', (req, res, next) => {
  const location = req.params.location;
  Pet.find()
  .where('_id').equals(location)
  .sort('_id')
  .exec()
  .then(pets => {
    console.log(pets);
    res.status(200).json(pets);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

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
    picture: req.body.picture
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


module.exports = router;
