const db = require('../model/subifyModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const authController = {};

//Controller function which serves to verify the user
authController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;
  const queryString = 'SELECT * FROM public.users WHERE username = $1;';
  const params = [username];
  db.query(queryString, params)
    .then((result) => {
      if (result.rows[0]) {
        bcrypt
          .compare(password, result.rows[0].password)
          .then((match) => {
            if (match === false) return next({ message: { error: 'Incorrect username or password' } });
            else res.locals.username = result.rows[0].username;
            return next();
          })
          .catch((err) => next('Error in verify Bcrypt', err));
      }
    })
    .catch((err) => {
      return next(err);
    });
};

//Controller function to set a new cookie
authController.setCookie = (req, res, next) => {
  //Check to see if a valid login request was found by verifyUser
  if (res.locals.username) {
    res.cookie('token', res.locals.username, { httpOnly: true, secure: true, overwrite: true });
  }
  return next();
};

authController.setSession = (req, res, next) => {
  // //Check to see if a valid login request was found by verifyUser
  // // DELETE FROM subscriptions WHERE id = ($1)
  // const queryString1 = 'DELETE FROM public.sessions WHERE username = $1';
  // const values1 = [res.locals.username];
  // db.query(queryString1, values1)
  //   .then(() => {
  //     const queryString2 = 'INSERT INTO public.sessions (username, time) VALUES ($1, $2)';
  //     const values2 = [res.locals.username, Date.now()];
  //     db.query(queryString2, values2)
  //       .then((result) => {
  //         return next();
  //       })
  //       .catch((err) => next(err));
  //   })
  //   .catch((err) => next(err));
  req.session.username = res.locals.username;
  console.log(req.session);
  return next();
};

authController.verifySession = (req, res, next) => {
  if (req.session.passport) {
    if (req.session.passport.user.username !== undefined) {
      res.locals.verified = true;
    }
  } else {
    res.locals.verified = false;
  }
  return next();
  // const queryString = 'SELECT * FROM public.sessions WHERE username = $1';
  // const user = [req.cookies.token];

  // db.query(queryString, user)
  //   .then((results) => {
  //     if (results.rows.length > 0) {
  //       const currTime = Date.now();
  //       if (currTime - results.rows[0].time < 60000) {
  //         console.log(currTime - results.rows[0].time);
  //         res.locals.verified = true;
  //       } else res.locals.verified = false;
  //     } else res.locals.verified = false;

  //     return next();
  //   })
  //   .catch((err) => next(err));
};

// -----

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    // // our own set session
    // const queryString1 = 'DELETE FROM public.sessions WHERE username = $1';
    // const values1 = [user.username];
    // db.query(queryString1, values1)
    //   .then(() => {
    //     const queryString2 = 'INSERT INTO public.sessions (username, time) VALUES ($1, $2)';
    //     const values2 = [user.username, Date.now()];
    //     db.query(queryString2, values2)
    //       .then((result) => {
    //         console.log(result);
    //         cb(null, user.username);
    //       })
    //       .catch((err) => console.log(err));
    //   })
    //   .catch((err) => console.log(err));
    // // passport cb
    cb(null, { username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

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
      db.query('SELECT * FROM public.users WHERE username = $1', [profile.id])
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
              'INSERT INTO public.users (username, provider, first_name, last_name, password, location, email, phone_number, account_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING*',
              data
            )
              .then((result2) => {
                console.log(result2.rows[0]);
                return cb(null, result2.rows[0]);
              })
              .catch((error) => cb(error));
          }
        })
        .catch((error) => cb(error));
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      // usernameField: 'username',
      // passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    function (req, usr, pss, done) {
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
