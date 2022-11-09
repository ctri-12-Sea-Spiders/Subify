const express = require('express');
const authController = require('../controllers/authController.js');

const router = express.Router();

//Check the user login credentials and if valid then assign a cookie to them and sign-in
router.post('/', authController.verifyUser, authController.setCookie, authController.setSession, (req, res) => {
  return res.status(200).send(res.locals.username);
});


module.exports = router;