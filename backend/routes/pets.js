var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./petDataBase.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Yay! Pets is connected to the database!');
});

router.get('/petId=:petId', (req, res, next) => {
  let petId = req.params.petId;
  const stmtPetId = db.prepare(`SELECT * FROM plsfdfldfd3 WHERE petId=(?);`);
  const stmtUserId = db.prepare(`SELECT * FROM cjansdfkjdsnf WHERE userId=(?);`);
  let x = stmtPetId.all(petId, (err, petInfo) => {
    if (err) return next(err);
    if (!isEmpty(petInfo[0])) {
      let userId = petInfo[0].userId;
      stmtUserId.all(userId, (err1, userInfo) => {
        if (err1) return next(err1);
        if (!isEmpty(userInfo[0])) {
          petInfo[0]['userInfo'] = userInfo;
          res.send({ petInfo });
        } else {
          petInfo[0]['userInfo'] = "User info don't exist.";
          res.send({ petInfo });
        }
      });
    } else {
      res.send('No id found');
    }
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
