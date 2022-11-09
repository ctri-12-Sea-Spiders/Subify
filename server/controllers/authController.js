const db = require('../model/subifyModel');

const AuthController = {};

//Controller function which serves to verify the user
AuthController.verifyUser = (req, res, next) => {

  const { username, password } = req.body;
  console.log('Username',username,'Password',password)
  //SELECT* FROM public.user WHERE ($1,$2) RETURNING*;
  const queryString = 'SELECT * FROM public.users WHERE username = $1 AND password = $2;';
  const params = [username, password];

  db.query(queryString, params)
    .then(result => {
      if(result.rows) {
        //Console log for debugging purposes
        console.log(result.rows[0]);

        //Check to see if a valid match was found
        if(result.rows.length > 0)
          res.locals.username = result.rows[0].username;
        else
          res.locals.username = {};

        return next();
      }
    })
    .catch(err => {
      return next(err);
    }); 
};

//Controller function to set a new cookie
AuthController.setCookie = (req, res, next) => {
  //Check to see if a valid login request was found by verifyUser
  if(res.locals.username) {
    res.cookie('token', res.locals.username);
  }
  return next();
};

module.exports = AuthController;
