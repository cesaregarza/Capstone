var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./petDataBase.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Yay! Auth is connected to the database!');
});


module.exports = router;
