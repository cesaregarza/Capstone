const express = require("express");
const router = express.Router();
const Pet = require("../models/pet");

router.get("/i=:id", (req, res, next) => {
  Pet.findById(req.params.id)
    //select the propieries to show
    .select(
      "_id name location specie size age breed description gender picture center"
    )
    .populate("center", "name address city postal phone email hours picture")
    .exec()
    .then(pets => {
      //Validate the answer is not empty
      if (!pets) {
        return res.status(404).json({
          message: "Pet id not found."
        });
      }
      res.status(201).json(pets);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/\?:super", (req, res, next) => {
  let spr = req.params.super.match(/((?<=^|&)([a-zA-Z]+=[\da-zA-Z]+))/g);
  let location = "";
  let specie = "";
  let ps = 0;
  let pn = 0;
  let findObj = {};
  spr == null
    ? res.status(500).json({
        error: "Incorrect syntax"
      })
    : null;

  for (let i = 0; i < spr.length; i++) {
    spr[i].split("=")[0] == "location"
      ? (location = spr[i].split("=")[1])
      : null;
    spr[i].split("=")[0] == "specie" ? (specie = spr[i].split("=")[1]) : null;
    spr[i].split("=")[0] == "ps" ? (ps = parseInt(spr[i].split("=")[1])) : null;
    spr[i].split("=")[0] == "pn" ? (pn = parseInt(spr[i].split("=")[1])) : null;
  }
  ps == 0 ? (ps = 10) : null;
  pn == 0 ? (pn = 1) : null;
  location !== ""
    ? (findObj.location = { $regex: location, $options: "$i" })
    : null;
  specie !== "" ? (findObj.specie = { $regex: specie, $options: "$i" }) : null;

  Pet.find(findObj)
    //select the propieries to show
    .select(
      "_id name location specie size age breed description gender picture center"
    )
    .populate("center", "name address city postal phone email hours picture")
    .limit(ps)
    .skip(ps * (pn - 1))
    .exec()
    .then(pets => {
      // console.log(pets);
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
          };
        })
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// router.get("/", (req, res, next) => {
//   Pet.find()
//     //select the propieries to show
//     .select(
//       "_id name location specie size age breed description gender picture center"
//     )
//     .populate("center", "name address city postal phone email hours picture")
//     .exec()
//     .then(pets => {
//       console.log(pets);
//       res.status(200).json({
//         count: pets.length,
//         pets: pets.map(pet => {
//           return {
//             _id: pet._id,
//             name: pet.name,
//             location: pet.location,
//             specie: pet.specie,
//             size: pet.size,
//             age: pet.age,
//             breed: pet.breed,
//             description: pet.description,
//             gender: pet.gender,
//             picture: pet.picture,
//             center: pet.center
//           };
//         })
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

module.exports = router;
