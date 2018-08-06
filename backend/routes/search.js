const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');
const Center = require('../models/center');


router.get('/:id', (req, res, next) => {
  let petsObj = {}
  Pet.findById(req.params.id)
    //select the propieries to show
    .select('_id _uid name location specie size age breed description gender picture')
    .then(pets => {
      //Validate the answer is not empty
      if (!pets) {
        return res.status(404).json({
          message: "Pet id not found."
        })
      }
      petsObj = pets;
      return Center.findById(pets._uid)
        //select the propieries to show
        .select('_id name address city postal phone email hours')
        .exec()
    })
    .then(center => {
      res.status(200).json({
        pet: petsObj,
        center: center
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

router.get('/', (req, res, next) => {
  Pet.find()
    //select the propieries to show
    .select('_id _uid name location specie size age breed description gender picture')
    .exec()
    .then(pets => {
      console.log(pets);
      res.status(200).json({
        count: pets.length,
        pets: pets.map(pet => {
          return {
            _id: pet._id,
            _uid: pet._uid,
            name: pet.name,
            location: pet.location,
            specie: pet.specie,
            size: pet.size,
            age: pet.age,
            breed: pet.breed,
            description: pet.description,
            gender: pet.gender,
            picture: pet.picture
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
  const location = /req.params.location/;
  Pet.find()
    //select the propieries to show
    .select('_id _uid name location specie size age breed description gender picture')
    //regex with $options:"$i" to make the search case insensitive
    .where('location').equals({ $regex: location, $options: "$i" })
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

router.get('/s=:specie', (req, res, next) => {
  const specie = req.params.specie;
  Pet.find()
    //select the propieries to show
    .select('_id _uid name location specie size age breed description gender picture')
    //regex with $options:"$i" to make the search case insensitive
    .where('specie').equals({ $regex: specie, $options: "$i" })
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


module.exports = router;
