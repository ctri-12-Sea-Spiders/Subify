const express = require('express');
const authController = require('../controllers/authController.js');
const { route } = require('./subscriptionsApi.js');

const router = express.Router();

//Check the user login credentials and if valid then assign a cookie to them and sign-in
router.post('/', authController.verifyUser, authController.setCookie, authController.setSession, (req, res) => {
  return res.status(200).send({username: res.locals.username});
});

router.get('/', authController.verifySession, (req,res) => {
  console.log(res.locals.verified)
  return res.status(200).send(res.locals.verified)
})


module.exports = router;