const db = require('../model/subifyModel');

const authController = {};

//Controller function which serves to verify the user
authController.verifyUser = (req, res, next) => {

  const queryString = 'SELECT * FROM public.users WHERE username = $1 AND password = $2;';
  const params = [req.body.username, req.body.password];

  db.query(queryString, params)
    .then(result => {
      if(result.rows) {
        //Console log for debugging purposes
        console.log(result.rows[0]);

        //Check to see if a valid match was found
        if(result.rows.length > 0)
          res.locals.username = result.rows[0].username;
        else
          res.locals.username = undefined;

        return next();
      }
    })
    .catch(err => {
      return next(err);
    }); 
};

//Controller function to set a new cookie
authController.setCookie = (req, res, next) => {
  //Check to see if a valid login request was found by verifyUser
  if(res.locals.username) {
    res.cookie('token', res.locals.username, {httpyOnly: true, secure: true, overwrite: true});
  }
  return next();
};

authController.setSession = (req, res, next) => {
  //Check to see if a valid login request was found by verifyUser
  const queryString = `INSERT INTO public.sessions (username, time) VALUES ($1, $2)`
  const sessionData = [res.locals.username, Date.now()]
  
  db.query(queryString, sessionData) 
    .then(result => {
      return next();
    })
    .catch(err =>  next(err))
};

authController.verifySession = (req, res, next) => {
  
const queryString = `SELECT * FROM public.sessions WHERE username = $1`

const user = [req.cookies.token];

db.query(queryString, user)
  .then(results => {
    if (!results.row) {

    } else if (results.row.length > 0) {
      
    }
  })

}

module.exports = authController;
