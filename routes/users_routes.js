const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const db = require('../db')

router.get('/signup', (req, res) => {
  res.render('signup')
})


router.post('/signup', (req, res) => {
  
  let email = req.body.email
  let password = req.body.password
  const saltRounds = 10;

  const sql = `
    INSERT INTO users (email, password_digest)
    VALUES ($1, $2);
  `
  


  // 1. generate some salt
  bcrypt.genSalt(saltRounds, function(err, salt) {
  
    // 2. hash the password with the salt
    bcrypt.hash(password, salt, function(err, hash) {
      
      // 3. insert user & hashed password into database
      db.query(sql, [email, hash], (err, dbRes) => {
        if (err) {
          console.log(err);
         return res.render('signup')
        }
      res.redirect('/login')
    })
  })
  })
})


module.exports = router
