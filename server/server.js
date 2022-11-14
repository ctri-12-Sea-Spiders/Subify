require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const db = require('./model/subifyModel');

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
const sessionConfig = {
  store: new pgSession({
    pool: db.pool,
    tableName: 'user-sessions',
    createTableIfMissing: true,
  }),
  secret: 'keyboard cat', // eventually convert to env var
  resave: false,
  saveUninitialized: false,
  cookie: {
    // maxAge: 1000 * 60,
    // sameSite: true,
    // httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
  },
};

app.use(session(sessionConfig));

// app.use(
//   session({
//     secret: 'keyboard cat',
//     resave: false, // don't save session if unmodified
//     saveUninitialized: false, // don't create session until something stored
//   })
// );

app.use(passport.authenticate('session'));
// app.use(function (req, res, next) {
//   // try {
//   //   if (req.session.passport.user) {
//   //     res.cookie('token', req.session.passport.user, { httpOnly: true, secure: true, overwrite: true });
//   //   }
//   // } catch {
//   //   console.log('not authorized');
//   // }
//   var msgs = req.session.messages || [];
//   res.locals.messages = msgs;
//   res.locals.hasMessages = !!msgs.length;
//   req.session.messages = [];
//   next();
// });

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

app.use((err, req, res, next) => {
  const defaultError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { error: 'An error occurred' },
  };
  const errorObj = Object.assign(defaultError, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

//Start server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
