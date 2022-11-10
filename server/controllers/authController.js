const db = require('../model/subifyModel');
const bcrypt = require('bcryptjs');
const AuthController = {};

//Controller function which serves to verify the user
AuthController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;
  const queryString = 'SELECT * FROM public.users WHERE username = $1;';
  const params = [username];

  db.query(queryString, params)
    .then((result) => {
      if (result.rows[0]) {
        bcrypt
          .compare(password, result.rows[0].password)
          .then((match) => {
            console.log(match);
            if (match === false) res.locals.username = {};
            else res.locals.username = { username: result.rows[0].username };
            return next();
          })
          .catch((err) => next('Error in verify Bcrypt', err));
      }
    })
    .catch((err) => {
      return next(err);
    });
};

//Controller function to set a new cookie
AuthController.setCookie = (req, res, next) => {
  //Check to see if a valid login request was found by verifyUser
  if (res.locals.username.username) {
    res.cookie('token', res.locals.username.username);
  }
  return next();
};

module.exports = AuthController;
