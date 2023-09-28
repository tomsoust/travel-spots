require('dotenv').config()
const bcrypt = require('bcrypt')

const db = require('./index.js')

const email = 'tomsoust@beast.co'
const password = 'macbook'
const saltRounds = 10;

const sql = `
INSERT INTO users (email, password_digest)
VALUES ($1, $2);`

bcrypt.genSalt(saltRounds, function(err, salt) {
  bcrypt.hash(password, salt, function(err, hash) {
    db.query(sql, [email, hash], (err) => {
      if (err) {
        console.log(err)
      }else {
        console.log('user created');
      }
    })

  });
});