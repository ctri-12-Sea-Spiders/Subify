const db = require('../model/subifyModel');


const usersController = {};

//Get and return all subscription info from the user's subscription database
// usersController.getUserSubInfo = (req, res, next) => {
//   const username = req.cookies.token;
//   const queryString = `SELECT * FROM ${username}`;

//   db.query(queryString)
//     .then(results => {
//       res.locals.subscriptionInfo = results.rows;
//       return next();
//     })
//     .catch(err => {
//       return next(err);
//     });
// };

//Create a new user and add them to the username database
usersController.createUser = (req, res, next) => {
  const queryString = 'INSERT INTO public.users (username, password, account_date, first_name, last_name, location, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';

  const createUserDetails = [
    req.body.username,
    req.body.password,
    new Date(),
    req.body.first_name,
    req.body.last_name,
    req.body.location,
    req.body.email,
    req.body.phone_number
  ];

  db.query(queryString, createUserDetails, (err, result) =>{
    if(err) return next(err);
    res.locals.username = req.body.username;
    return next();
  });
};

module.exports = usersController;