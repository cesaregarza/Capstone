const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var path = require('path');
const mongoose = require('mongoose');

// var index = require('./routes/index');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');
var searchRouter = require('./routes/search');
var petsRouter = require('./routes/pets');
var centersRouter = require('./routes/centers');
var usersRouter = require('./routes/users');


mongoose.connect('mongodb+srv://dbpets:ioa65MCjNuiFfWBe@petsdb-165j8.mongodb.net/test?retryWrites=true', {
  useNewUrlParser: true
}).then(() => {
  console.log("Connected to Database");
}).catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
});
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next, ) => {
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req === 'OPTIONS') {
    res.header('Access-Control-Alloq-Methods', 'GET, PUT, POST, PATCH, DELETE');
    return res.status(200).json({});
  };
  next();
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// app.get('/api', (req, res) => {
// if(req.session.page_views){
//   req.session.page_views++;
//   res.send('You visited this page ' + req.session.page_views + ' times');
// } else {
//   req.session.page_views = 1;
//   res.send('Welcome to this page for the first time!');
// }
// });

// app.use('/', index);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/search', searchRouter);
app.use('/pets', petsRouter);
app.use('/centers', centersRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;
