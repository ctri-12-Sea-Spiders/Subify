const express = require('express');
const authController = require('../controllers/authController.js');
const passport = require('passport');

const db = require('../model/subifyModel');
const router = express.Router();

// //Check the user login credentials and if valid then assign a cookie to them and sign-in
// router.post('/', authController.verifyUser, authController.setCookie, authController.setSession, (req, res) => {
//   req.session.loggedIn = true;
//   return res.status(200).send({ username: res.locals.username });
// });

// router.post('/', authController.verifyUser, authController.setSession, (req, res) => {
//   return res.status(200).send({ username: res.locals.username });
// });

router.post('/', passport.authenticate('local', { failureRedirect: '/' }), function (req, res) {
  console.log('session', req.session);
  res.status(200).send(req.session.passport.user);
});

router.get('/', authController.verifySession, (req, res) => {
  console.log('session', req.session);
  return res.status(200).send(res.locals.verified);
});

router.get('/login/google', passport.authenticate('google'));

router.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', {
    successReturnToOrRedirect: '/home',
    failureRedirect: '/',
  })
);

module.exports = router;
