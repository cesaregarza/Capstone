var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./petDataBase.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Yay! You are connected to the database!');
});


router.get('/searchP/:location&:species', (req, res, next) => {
  let location = req.params.location;
  let species = req.params.species;
  const stmt = db.prepare(`SELECT * FROM pets WHERE location=(?) OR species=(?);`)
  stmt.all([location, species], (err, items) => {
    if (err) throw err;
    let totalResult = items.length;
    res.send({ items, totalResult });
  });
});

router.get('/searchC/:location', (req, res, next) => {
  let location = req.params.location;
  const stmt = db.prepare(`SELECT * FROM centers WHERE city LIKE (?);`)
  stmt.all(location, (err, items) => {
    if (err) throw err;
    let totalResult = items.length;
    res.send({ items, totalResult });
  });
});

router.get('/userI/:username', (req, res, next) => {
  let username = req.params.username;
  const stmt = db.prepare(`SELECT * FROM users WHERE username=(?);`)
  stmt.all(username, (err, items) => {
    if (err) throw err;
    let totalResult = items.length;
    res.send({ items, totalResult });
  });
});
var petInfo;
router.get('/petId/:petId', (req, res, next) => {
  let petId = req.params.petId;

  let userId;
  const stmt = db.prepare(`SELECT * FROM pets WHERE petId=(?);`);
  stmt.all(petId, (err, items) => {
    if (err) throw err;
    let totalResult = items.length;
    petInfo = items
    res.send({ petInfo });
  });

  const stmt1 = db.prepare(`SELECT * FROM centers WHERE userId=(?);`);
  stmt1.all(2, (err, items) => {
    if (err) throw err;
    let totalResult = items.length;
    userInfo = items;
    res.send({ items });
  });


});


centerInfo = (id, item) => {
  let x;
  const stmt = db.prepare(`SELECT * FROM centers WHERE userId=(?);`)
  stmt.all(id, (err, items) => {
    if (err) throw err;
    let totalResult = items.length;
    console.log(items);
    res.send({ item, items, totalResult });
  });
};

module.exports = router;
