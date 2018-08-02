var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./petDataBase.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Yay! Search is connected to the database!');
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


module.exports = router;
