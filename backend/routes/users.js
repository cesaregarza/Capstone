var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./petDataBase.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Yay! Users is connected to the database!');
});

router.get('/userI/:username', (req, res, next) => {
    let username = req.params.username;
    const stmt = db.prepare(`SELECT * FROM uknekrjnekjnw WHERE username=(?);`)
    stmt.all(username, (err, items) => {
      if (err) throw err;
      let totalResult = items.length;
      res.send({ items, totalResult });
    });
  });

module.exports = router;
