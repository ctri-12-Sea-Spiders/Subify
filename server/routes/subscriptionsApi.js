const express = require('express');
const subscriptionController = require('../controllers/subscriptionController.js');

const router = express.Router();

//Get all the subscriptions a user is signed up to
router.get('/', subscriptionController.getSubscriptions, (req, res) => {
  return res.status(200).json(res.locals.subscriptionInfo);
});

//Add the user's subscriptions adding a new sub
router.post('/', subscriptionController.addSubscription, (req, res) => {
  return res.sendStatus(200);
});

//Delete the subscription from the users account
router.delete('/', subscriptionController.deleteSubscription, (req, res) => {
  return res.sendStatus(200);
});
//Update a subscription from the DB
router.patch('/', subscriptionController.updateSubscription, (req, res) => {
  return res.sendStatus(200);
});

module.exports = router;
