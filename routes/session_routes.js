const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()
const db = require('../db')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {

  sql = `
  SELECT * FROM users WHERE email = $1;`

  values = [req.body.email]

  db.query(sql, values, (err, dbRes) => {
    if(err) {
      console.log(err)
    }
    
    if (dbRes.rows.length === 0) {
     return res.render('login')
    }
  


    const userInputPassword = req.body.password
    const hashedPassword = dbRes.rows[0].password_digest

    bcrypt.compare(userInputPassword, hashedPassword, (err, result) => {
      if(result) {
        req.session.userId = dbRes.rows[0].id
        return res.redirect('/')
      } else {
      return res.render('login')
      }
    })  
  })

})

router.delete('/logout', (req, res) =>{
  req.session.userId = null
  res.redirect('/login')
})


module.exports = router