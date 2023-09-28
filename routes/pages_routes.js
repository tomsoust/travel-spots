const express = require('express')

const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
  db.query('SELECT * FROM locations', (err, dbRes) => {
    if (err) {
      console.log(err)
    }
    const locations = dbRes.rows
    res.render('home', { locations })
  })
})


router.get('/about', (req, res) => {
  res.render('about')
})

module.exports = router