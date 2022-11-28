const express = require('express');
const authController = require('../controllers/authController.js');
const passport = require('passport');

const router = express.Router();

// handles login route using passport-local strategy
router.post('/', passport.authenticate('local', { failureRedirect: '/' }), function (req, res) {
  res.status(200).send(req.session.passport.user);
});

// verify express-session instance is valid
router.get('/', authController.verifySession, (req, res) => {
  return res.status(200).send(res.locals.verified);
});

// handles login route via passport's google OAuth2.0 strategy
router.get('/login/google', passport.authenticate('google'));

// handle redirect from google following authentication attempt
router.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', {
    successReturnToOrRedirect: '/home',
    failureRedirect: '/',
  })
);

module.exports = router;
