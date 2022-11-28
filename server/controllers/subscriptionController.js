const db = require('../model/subifyModel.js');

const subscriptionController = {};

//Add a new subscription to the user
subscriptionController.addSubscription = (req, res, next) => {
  const values = [
    req.session.passport.user.username,
    req.body.subscription_name,
    req.body.monthly_price,
    req.body.due_date,
    req.body.category,
  ];
  const queryString =
    'INSERT INTO subscriptions (username, subscription_name, subscription_price, due_date, category) VALUES($1, $2, $3, $4, $5) RETURNING*;';

  db.query(queryString, values)
    .then((result) => {
      console.log(result);
      res.locals.user = result.rows;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

//Delete a user subscription
subscriptionController.deleteSubscription = (req, res, next) => {
  const values = [req.body.id];
  const queryString = 'DELETE FROM subscriptions WHERE id = ($1);';

  db.query(queryString, values)
    .then((result) => {
      res.locals.user = result.rows;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

// Get all subscriptions for the current user
subscriptionController.getSubscriptions = (req, res, next) => {
  const username = req.session.passport.user.username;
  const values = [username];
  const queryString = 'SELECT * FROM public.subscriptions WHERE username = ($1);';

  db.query(queryString, values)
    .then((result) => {
      res.locals.subscriptionInfo = result.rows;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

// Update a user's subscription
subscriptionController.updateSubscription = (req, res, next) => {
  const values = [req.body.id, req.body.subscription_name, req.body.monthly_price, req.body.content];
  const queryString = 'UPDATE subscriptions SET subscription_name = ($2), subscription_price = ($3), category = ($4) WHERE id = ($1);';

  db.query(queryString, values)
    .then((result) => {
      res.locals.user = result.rows;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

module.exports = subscriptionController;
