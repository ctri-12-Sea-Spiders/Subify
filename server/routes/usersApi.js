const express = require('express');
const usersController = require('../controllers/usersController.js');
// const SubscriptionController = require('../controllers/usersController.js');

const router = express.Router();

// Create a new user and add them to the database
router.post('/', usersController.createUser, (req, res) => {
  return res.status(200).json(res.locals);
});

// Serve session info
router.get('/', usersController.getUser, (req, res) => {
  return res.status(200).json(res.locals);
});

module.exports = router;
