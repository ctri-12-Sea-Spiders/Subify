const express = require('express');
const subscriptionController = require('../controllers/subscriptionController.js');

const router = express.Router();

//Get all categories for a specific type (Implemented but not used by frontend | missing feature: when sub is added add to this database)
// router.get('/type/:value', subscriptionController.getInformation, (req, res) => {
//   return res.status(200).send(res.locals.information);
// });

//Get the category specified in the body (Implemented but not used by frontend | missing feature: when sub is added add to this database)
// router.get('/category/:value', subscriptionController.getInformation, (req, res) => {
//   return res.status(200).send(res.locals.information);
// });

//Get all the subscriptions a user is signed up to
router.get('/', subscriptionController.getSubscriptions, (req, res) =>{
  //console.log('Response', res.locals.subscriptionInfo);
  return res.status(200).send(res.locals.subscriptionInfo);
});

//Add the user's subscriptions adding a new sub
router.post('/', subscriptionController.addSubscription, (req, res) =>{
  return res.sendStatus(200);
});

//Delete the subscription from the users account (not implemented by frontend)
router.delete('/', subscriptionController.deleteSubscription, (req, res) =>{
  return res.sendStatus(200);
});


module.exports = router;