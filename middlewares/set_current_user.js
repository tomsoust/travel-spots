const db = require('../db/index.js')

function setCurrentUser(req, res, next) {

  //res.locals is when we want to make available values in templates everywhere
  res.locals.userId = req.session.userId   

  if (!req.session.userId) {
    return next()
  }

// getting id details from the databse
  const sql = `SELECT * FROM users WHERE id = $1;`

  db.query(sql, [req.session.userId], (err, dbRes) => {
    if (err) {
      console.log(err)
      process.exit(1) // stop the app 
    } else {
      const user = dbRes.rows[0]
      res.locals.user = user
      
    }
    next()
  })
}

module.exports = setCurrentUser