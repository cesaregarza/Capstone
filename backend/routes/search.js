const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');
const Center = require('../models/center');


router.get('/i=:id', (req, res, next) => {
  Pet.findById(req.params.id)
    //select the propieries to show
    .select('_id name location specie size age breed description gender picture center')
    .populate("center", "name address city postal phone email hours picture")
    .exec()
    .then(pets => {
      //Validate the answer is not empty
      if (!pets) {
        return res.status(404).json({
          message: "Pet id not found."
        })
      }
      res.status(201).json(pets)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

router.get('/', (req, res, next) => {
  let pageSize =  13;
  let pageNo =  2;
  Pet.find()
    //select the propieries to show
    .select('_id name location specie size age breed description gender picture center')
    .populate("center", "name address city postal phone email hours picture")
    .limit(pageSize)
    .skip(pageSize * (pageNo - 1))
    .exec()
    .then(pets => {
      console.log(pets);
      res.status(200).json({
        count: pets.length,
        pets: pets.map(pet => {
          return {
            _id: pet._id,
            name: pet.name,
            location: pet.location,
            specie: pet.specie,
            size: pet.size,
            age: pet.age,
            breed: pet.breed,
            description: pet.description,
            gender: pet.gender,
            picture: pet.picture,
            center: pet.center
          }
        })
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

router.get('/l=:location', (req, res, next) => {
  Pet.find()
    //select the propieries to show
    .select('_id name location specie size age breed description gender picture center')
    .populate("center", "name address city postal phone email hours picture")
    //regex with $options:"$i" to make the search case insensitive
    .where('location').equals({ $regex: req.params.location, $options: "$i" })
    .sort({ _id: -1 })
    .exec()
    .then(pets => {
      if (pets.length === 0) {
        res.status(404).json({
          message: "No found"
        });
      }
      res.status(200).json({
        count: pets.length,
        pets: pets
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

router.get('/s=:specie', (req, res, next) => {
  Pet.find()
    //select the propieries to show
    .select('_id name location specie size age breed description gender picture center')
    .populate("center", "name address city postal phone email hours picture")
    //regex with $options:"$i" to make the search case insensitive
    .where('specie').equals({ $regex: req.params.specie, $options: "$i" })
    .sort({ _id: -1 })
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

isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
};

module.exports = router;
