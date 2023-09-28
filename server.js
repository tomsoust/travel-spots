require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const pg = require('pg')
const app = express()
const port = 8080
const methodOverride = require('method-override')

const db = new pg.Pool({
  database: 'travel_places',
})

app.set('view engine', 'ejs')

// for serving static files like style.css
app.use(express.static('public'))

// look into the request and parse the body in urlencoded format and turn it in an object and assign to req.body = {}
app.use(express.urlencoded({ extended: true }))



// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn’t support it.
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(expressLayouts)

app.get('/', (req, res) => {
  db.query('SELECT * FROM locations', (err, dbRes) => {
    if (err) {
      console.log(err)
    }
    const locations = dbRes.rows
    res.render('home', { locations })
  })
})


app.get('/about', (req, res) => {
  res.render('about')
})


app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {

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

app.get('/signup', (req, res) => {

  res.render('signup')
})

app.get('/places', (req, res) => {
  res.render('new_form')
})

app.post('/places', (req, res) => {

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

app.get('/places/:id', (req, res) => {
  const sql = 'SELECT * FROM locations WHERE id = $1'
  const values = [req.params.id]

  db.query(sql, values, (err, dbRes) => {
    if (err) {
      console.log(err)
    }
    const location = dbRes.rows[0]
    console.log(location);
    res.render('show', { location })
  })
})

app.delete('/places/:id', (req, res) => {
  const sql = 'DELETE FROM locations WHERE id = $1'
  const values = [req.params.id]

  db.query(sql, values, (err, dbRes) => {
    if (err) {
      console.log(err)
    }
    res.redirect('/')
  })
})

app.get('/places/:id/edit', (req, res) => {

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

app.put('/places/:id', (req, res) => {
  
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

app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`)
})