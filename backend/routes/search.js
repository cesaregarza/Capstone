const express = require("express");
const router = express.Router();
const Pet = require("../models/pet");
const checkAuth = require("../middleware/check-auth");

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

router.get("/?:super", (req, res, next) => {
  //Regex with lookbehind. TODO: Figure out if it works on other servers. TODO: Make this much more specific.
  // let re = /((?<=^|&)([a-zA-Z]+=[\da-zA-Z]+))/g;
  let re = /(([a-zA-Z]+=[\da-zA-Z]+))/g;

  //Match the superroute with the regex, creating groups
  let spr = req.params.super.match(re);
  //Initialize variables
  let location = "";
  let specie = "";
  let center = "";
  let ps = 0;
  let pn = 0;
  let findObj = {};
  let countAll = 0;

  //If no regex groups are returned, send a 500 error message saying Syntax is incorrect
  if (spr !== null) {
    //Iterate through all regex groups, setting variables to their equivalents as mentioned in the API documentation.
    for (let i = 0; i < spr.length; i++) {
      if (spr[i].split("=")[0] == "center") {
        center = spr[i].split("=")[1];
      }
      if (spr[i].split("=")[0] == "location") {
        location = spr[i].split("=")[1];
      }
      if (spr[i].split("=")[0] == "specie") {
        specie = spr[i].split("=")[1];
      }
      if (spr[i].split("=")[0] == "ps") {
        ps = parseInt(spr[i].split("=")[1]);
      }
      if (spr[i].split("=")[0] == "pn") {
        pn = parseInt(spr[i].split("=")[1]);
      }
    }
  }
  //Set defaults for ps and pn if not found
  ps = !ps ? 12 : ps;
  pn = !pn ? 1 : pn;

  //Set 
  if (!!center) {
    findObj.center = center;
  } else {
    //Set defaults for location and species if not found
    if (!!location) {
      findObj.location = { $regex: location, $options: "$i" };
    }
    if (!!specie) {
      findObj.specie = { $regex: specie, $options: "$i" };
    }
  }

  //Count the results we'll get.
  Pet.countDocuments(findObj, (err, count) => {
    countAll = count;
  });

  //Return all pets that fit in the query AND are not deleted
  Pet.find({ $and: [findObj, { isDeleted: { $ne: true } }] })
    //Select the propieries to show
    .select(
      "_id name location specie size age breed description gender picture center"
    )
    .populate("center", "name address city postal phone email hours picture")
    //Establish a limit based on Page Size
    .limit(ps)
    //Skip first results for pagination
    .skip(ps * (pn - 1))
    .sort({ field: "asc", _id: -1 })
    .exec()
    .then(pets => {
      if (!isEmpty(pets)) {
        console.log(countAll);
        res.status(200).json({
          count: pets.length,
          total: countAll,
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
      } else {
        res.status(404).json({
          message: "Not found"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//REMEMBER: Remove this for Production
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

var countPets = (err, count) => {
  return count;
};

module.exports = router;
