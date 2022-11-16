const db = require('../model/subifyModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const authController = {};

// Note: authcontroller controllers: verifyUser, setCookie, setSession removed after implementation of passport for all auth strategies

// check if session has been set, looking for username key on user obj
authController.verifySession = (req, res, next) => {
  if (req.session.passport) {
    if (req.session.passport.user.username !== undefined) {
      res.locals.verified = true;
    }
  } else {
    res.locals.verified = false;
  }
  return next();
};

// store data in session
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// for google OAuth2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/api/authenticate/oauth2/redirect/google',
      scope: ['profile'],
      state: true,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      // accessToken and refreshToken parameters unused
      db.query('SELECT * FROM public.users WHERE username = $1;', [profile.id])
        .then((result1) => {
          // if previously logged in
          if (result1.rows.length > 0) {
            return cb(null, result1.rows[0]);
          }
          // if new user
          else {
            const names = profile.displayName.split(' ');
            const data = [profile.id, 'google', names[0], names[1], '', '', '', '', ''];
            db.query(
              'INSERT INTO public.users (username, provider, first_name, last_name, password, location, email, phone_number, account_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING*;',
              data
            )
              .then((result2) => {
                return cb(null, result2.rows[0]);
              })
              .catch((error) => cb(error));
          }
        })
        .catch((error) => cb(error));
    }
  )
);

// for local login, passwords saved using Bcrypt
passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
      session: false,
    },
    function (req, usr, pss, done) {
      // usr and pss parameters unused
      const { username, password } = req.body;
      const queryString = 'SELECT * FROM public.users WHERE username = $1;';
      const values = [username];

      db.query(queryString, values)
        .then((result) => {
          if (result.rows[0]) {
            bcrypt
              .compare(password, result.rows[0].password)
              .then((match) => {
                if (match === false) return done(null, false);
                else return done(null, result.rows[0]);
              })
              .catch((err) => done(err));
          }
        })
        .catch((err) => done(err));
    }
  )
);
module.exports = authController;
