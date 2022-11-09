const db = require('../model/subifyModel.js');

const subscriptionController = {};

//Get information from either an indivual subscription or category (THIS IS NOT COMPLETE FRONTEND ENDED UP NOT NEEDING THIS REQUEST)
// subscriptionController.getInformation = (req, res, next) => {
//   //Get the value from the params passed into the browser
//   const paramVal = req.params.value;
  
//   //TODO update query string to select all subscriptions using user_id foreign key
//   const sqlQuery = `SELECT * FROM subscriptions, users where `;

//   db.query(sqlQuery)
//     .then(result => {
//       res.locals.information = result.rows;
//       return next();
//     })
//     .catch(err => {
//       return next(err);
//     });
//   return next;
// };

//Create the table needed to manage their subscriptions
// subscriptionController.createUserSubscriptions = (req, res, next) => {
//   //check frontend and make sure username in req.body
//   const username = req.cookies.token;
//   req.body
//   const queryString = `INSERT INTO subscriptions (username, subscription_name text, subscription_price text, due_date text, ategory text) VALUES ($1, $2, $3, $4, $5) RETURNING *
//   );`;

//   db.query(queryString)
//     .then(result => {
//       res.locals.user = result.rows;
//       return next();
//     })
//     .catch(err => {
//       return next(err);
//     });
// };

//Add a new subscription to the signed in users account database
subscriptionController.addSubscription = (req, res, next) => {
  const username = req.cookies.token;
  
  const values = [
    username,
    req.body.subscription_name,
    req.body.monthly_price,
    req.body.due_date,
    req.body.category
  ];

  // {"subscription_name":"hulu",
  //   "monthly_price":"$5.00",
  //   "due_date":"15th",
  //   "category":"streaming services"}

  const queryString = `INSERT INTO subscriptions (username, subscription_name, subscription_price, due_date, category) VALUES($1, $2, $3, $4, $5) RETURNING*;`;

  db.query(queryString, values)
    .then(result => {
      console.log(result)
      res.locals.user = result.rows;
      return next();
    })
    .catch(err => {
      return next(err);
    });
};

//Delete a subscription from the signed in users account database (not used by frontend at this time)
subscriptionController.deleteSubscription = (req, res, next) => {

  // {"subscription_id":"5"}
  const values = [req.body.subscription_id];
  const queryString = `DELETE FROM subscriptions WHERE id = ($1)`;

  db.query(queryString, values)
    .then(result => {
      console.log(result)
      res.locals.user = result.rows;
      return next();
    })
    .catch(err => {
      return next(err);
    });
};

subscriptionController.getSubscriptions = (req, res, next) => {
  const username = req.cookies.token;
  const values = [username];
  const queryString = `SELECT * FROM public.subscriptions WHERE username = ($1) `;

  db.query(queryString, values)
    .then(result => { 
      console.log(result)
      res.locals.subscriptionInfo = result.rows;
      return next();
    })
    .catch(err => {
      return next(err);
    });
};

/*  */
module.exports = subscriptionController;