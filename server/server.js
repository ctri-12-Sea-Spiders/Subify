require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

//Initalize express
const app = express();

//Require Routes
const usersAPI = require('./routes/usersApi.js');
const subscriptionsAPI = require('./routes/subscriptionsApi.js');
const authenticationAPI = require('./routes/authenticationApi.js');

//Setup port
const PORT = 3000;

//Parse cookies
app.use(cookieParser());

//Handle parsing the request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//OAuth session setup
app.use(
  session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
app.use(passport.authenticate('session'));
app.use(function (req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !!msgs.length;
  req.session.messages = [];
  next();
});

//Route Handlers
app.use('/api/users', usersAPI);
app.use('/api/subscriptions', subscriptionsAPI);
app.use('/api/authenticate', authenticationAPI);

//Base App handler
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../view/index.html'));
});

//Catch-all route handler
app.use('*', (req, res) => {
  res.sendStatus(404);
});

//Start server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
