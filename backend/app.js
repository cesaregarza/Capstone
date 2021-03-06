const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cors = require('cors');
const passport = require('./middleware/passport');
var cookieParser = require('cookie-parser');
var path = require('path');
const mongoose = require('mongoose');

var adminRouter = require('./routes/admin');
var searchRouter = require('./routes/search');
var petsRouter = require('./routes/pets');
var centersRouter = require('./routes/centers');
var usersRouter = require('./routes/users');
var newuserRouter = require('./routes/newuser');
var loginRouter = require('./routes/login');
var editopsRouter = require('./routes/editops');
var keys = require('./gitignore/keys');

mongoose.connect(`mongodb+srv://dbpets:${keys.PW}@petsdb-165j8.mongodb.net/test?retryWrites=true`, {
  useNewUrlParser: true
}).then(() => {
  console.log("Connected to Database");
}).catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
});


app.use(logger('dev'));
app.use('/upload', express.static('upload'));

corsOptions = {
  // Testing for deploy
  origin: "*",
  // credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH');
    return res.status(200).json({
      error: 'Hellow'
    });
  }
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
  secret: keys.session,
  cookie: {
      maxAge: 1000*3600*2,
      secure: true, //REMEMBER TO SET THIS FOR PRODUCTION
  },
  // store: sessionStore,
  resave: true,
  saveUninitialized: false,
  }));

//Set up session parameters
app.use(passport.initialize());
app.use(passport.session());

app.use('/admin', adminRouter);
app.use('/search', searchRouter);
app.use('/pets', petsRouter);
app.use('/centers', centersRouter);
app.use('/users', usersRouter);
app.use('/newuser', newuserRouter);
app.use('/user', loginRouter);
app.use('/editops', editopsRouter);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;
