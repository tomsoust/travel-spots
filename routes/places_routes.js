const express = require('express')
const router = express.Router()
const db = require('../db')
const ensureLoggedIn = require('../middlewares/ensure_logged_in')

router.get('/places', (req, res) => {
  res.render('new_form')
})

router.post('/places', ensureLoggedIn, (req, res) => {

  let name = req.body.name
  let imageUrl = req.body.image_url
  let country = req.body.country
  let activities = req.body.activities

  const sql = 'INSERT INTO locations (name, image_url, country, activities) VALUES ($1, $2, $3, $4)'

  db.query(sql, [name, imageUrl, country, activities], (err, dbRes) => {
    if (err) {
      console.log(err)
    }
    res.redirect('/')
    })
  })

router.delete('/places/:id', ensureLoggedIn, (req, res) => {
  const sql = 'DELETE FROM locations WHERE id = $1'
  const values = [req.params.id]

  db.query(sql, values, (err, dbRes) => {
    if (err) {
      console.log(err)
    }
    res.redirect('/')
  })
})

router.get('/places/:id', (req, res) => {
  const sql = 'SELECT * FROM locations WHERE id = $1'
  const values = [req.params.id]

  db.query(sql, values, (err, dbRes) => {
    if (err) {
      console.log(err)
    }
    const location = dbRes.rows[0]
    res.render('show', { location })
  })
})

router.get('/places/:id/edit', ensureLoggedIn, (req, res) => {

  let locationId = req.params.id
  let sql = `SELECT * FROM locations WHERE id = $1;`

  db.query(sql, [locationId], (err, dbRes) => {
    if (err) {
      console.log(err);
    }

    let location = dbRes.rows[0]
    res.render('edit_form', { location })
  })
})

router.put('/places/:id', ensureLoggedIn, (req, res) => {
  
  const sql = `
    UPDATE locations
    SET name = $1, image_url = $2, country = $3, activities = $4
    WHERE id = $5;
  `
  const values = [req.body.name, req.body.image_url, req.body.country, req.body.activities, req.params.id]

  db.query(sql, values, (err, dbRes) => {
    if (err) {
      console.log(err);
    }

    res.redirect(`/places/${req.params.id}`) 
  })
})

module.exports = router