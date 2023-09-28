require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const pg = require('pg')
const app = express()
const port = 8080
const methodOverride = require('method-override')
const session = require('express-session')
const setCurrentUser = require('./middlewares/set_current_user')


const placesRoutes = require('./routes/places_routes')
const usersRoutes = require('./routes/users_routes')
const pagesRoutes = require('./routes/pages_routes')
const sessionRoutes = require('./routes/session_routes')    


const db = new pg.Pool({
  database: 'travel_places',
})

app.set('view engine', 'ejs')

// for serving static files like style.css
app.use(express.static('public'))

// look into the request and parse the body in urlencoded format and turn it in an object and assign to req.body = {}
app.use(express.urlencoded({ extended: true }))

app.use(session({secret: process.env.SESSION_SECRET || "mistyrose", resave: false, saveUninitialized: true}))
app.use(setCurrentUser)


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


app.use(placesRoutes)
app.use(usersRoutes)
app.use(pagesRoutes)
app.use(sessionRoutes)

app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`)
})