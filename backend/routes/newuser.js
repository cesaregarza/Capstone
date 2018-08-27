const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const scrypt = require("scrypt");

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

// Testing hashed password with the login password
// router.get("/i=:id&p=:pass", (req, res, next) => {
//   Userlist.findOne({ _id: req.params.id })
//     .exec()
//     .then(result => {
//       let isTrue = scrypt.verifyKdfSync(result.hash, req.params.pass);
//       if (isTrue) {
//         res.status(200).json({
//           isCorrect: isTrue
//         });
//       } else {
//         res.status(401).json({
//             isCorrect: isTrue
//           });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// Fetch  all users information
router.get("/", (req, res, next) => {
  Userlist.find()
    .populate("_id")
    .exec()
    .then(users => {
      console.log(users);
      res.send(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.patch('/i=:userId', (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  console.log(req.body);
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.update({ _id: id }, { $set: updateOps }).exec()
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

router.post("/",  (req, res, next) => {
  let localPathCopy = localPath;

  const id = new mongoose.Types.ObjectId();
  
  //hashedpw. Hash a password using scrypt.
  //INPUT TYPES => OUTPUT TYPES: ((String || Buffer), Object) => (String || Buffer)
  const hashedpw = scrypt.kdfSync(req.body.password, scryptParameters); //REMEMBER: to use req.body.password NOT req.body.hash

  //Prep objects for database input
  const userlist = new Userlist({
    _id: id,
    hash: hashedpw,
    usertype: req.body.usertype,
    name: req.body.name,
    email: req.body.email,
    date_joined: req.body.date_joined,
    last_login: req.body.last_login,
    isDeleted: req.body.isDeleted
  });
  const user = new User({
    _id: id,
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    liked: req.body.liked,
    location: req.body.location,
    isDeleted: req.body.isDeleted
  });
  const center = new Center({
    _id: id,
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    postal: req.body.postal,
    phone: req.body.phone,
    hours: req.body.hours,
    isDeleted: req.body.isDeleted
  });
  //Search to see if email is already in use. If not, create the user.
  Userlist.find({ email: req.body.email })
    .exec()
    .then(email => {
      if (email.length >= 1) {
        return res.status(409).json({
          status: 409,
          message: "This email is already in use"
        });
      } else {
        userlist
          .save()
          .then(result => {
            //Save the user depending on where their profile belongs.
            if (req.body.usertype == 1) {
              user
                .save()
                .then(result => {
                  res.status(201).json({
                    status: 201,
                    message: "The user was successfully created.",
                    createdUser: result
                  });
                })
                .catch(err => {
                  res.status(500).json({
                    status: 500,
                    error: err
                  });
                });
            } else if (req.body.usertype == 2) {
              center
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                    status: 201,
                    message: "The center was successfully created.",
                    createdCenter: result
                  });
                })
                .catch(err => {
                  res.status(500).json({
                    status: 500,
                    error: err
                  });
                });
            }
          })
          .catch(err => {
            res.status(500).json({
              status: 500,
              error: err
            });
          });
      }
    })
    .catch(err => {
      res.status(500).json({
        status: 500,
        error: err
      });
    });
});

//REMEMBER: Fuck with this later
//upload.single("product-image")

// getUseslist = () => {
//     Userlist.find()
//     .exec()
//     .then(users => {
//     return users
//         // res.status(200).json(users);
//     })
//     .catch(err => {
//         console.log(err);
//         // res.status(500).json(err);
//     });

// }

module.exports = router;
