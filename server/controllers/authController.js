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
    res.cookie('token', res.locals.username, {httpOnly: true, secure: true, overwrite: true});
  }
  return next();
};

authController.setSession = (req, res, next) => {
  //Check to see if a valid login request was found by verifyUser
  // DELETE FROM subscriptions WHERE id = ($1)
  const queryString1 = `DELETE FROM public.sessions WHERE username = $1`
  const values1 = [res.locals.username]
  db.query(queryString1, values1) 
  .then(() => {
    const queryString2 = `INSERT INTO public.sessions (username, time) VALUES ($1, $2)`
    const values2 = [res.locals.username, Date.now()]
    db.query(queryString2, values2) 
      .then(result => {
        return next();
      })
      .catch(err => next(err))
  })
  .catch(err =>  next(err))



};

authController.verifySession = (req, res, next) => {
  
  const queryString = `SELECT * FROM public.sessions WHERE username = $1`
  const user = [req.cookies.token];
  
  db.query(queryString, user)
    .then(results => {
      if (results.rows.length > 0) {
        const currTime = Date.now();
        if (currTime - results.rows[0].time < 60000) {
          console.log(currTime - results.rows[0].time)
          res.locals.verified = true;
        } else res.locals.verified = false;
      } else res.locals.verified = false;
      
      return next();
    })
    .catch(err => next(err))
}

module.exports = authController;
