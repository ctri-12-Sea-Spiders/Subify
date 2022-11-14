const express = require('express');
const authController = require('../controllers/authController.js');
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const db = require('../model/subifyModel');
const router = express.Router();

// //Check the user login credentials and if valid then assign a cookie to them and sign-in
// router.post('/', authController.verifyUser, authController.setCookie, authController.setSession, (req, res) => {
//   req.session.loggedIn = true;
//   return res.status(200).send({ username: res.locals.username });
// });

router.post('/', authController.verifyUser, authController.setSession, (req, res) => {
  return res.status(200).send({ username: res.locals.username });
});

router.get('/', authController.verifySession, (req, res) => {
  return res.status(200).send(res.locals.verified);
});

// ------------------------------------------- OAUTH

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
      console.log('hi!!!!');
      db.query('SELECT * FROM public.users WHERE username = $1', [profile.id])
        .then((result1) => {
          // if previously logged in
          if (result1.rows.length > 0) {
            console.log(result1.rows[0]);
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

router.get('/login/google', passport.authenticate('google'));

router.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', {
    successReturnToOrRedirect: '/home',
    failureRedirect: '/',
  })
);

module.exports = router;
