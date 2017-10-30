'use strict'

var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var mongoose = require('mongoose')
var Task = require('./models/todoListModel')
var User = require('./models/userModel')
var bodyParser = require('body-parser')
var jsonwebtoken = require('jsonwebtoken')

mongoose.Promise = global.Promise

let options = {
  db: {native_parser: true},
  server: {poolSize: 5},
  user: 'hungvu',
  pass: '123456'
}

mongoose.connect('mongodb://localhost:27017/exMongoDb', options).then(
    () => {
      console.log('connect DB successfully')
    },
    err => {
      console.log(`Connection failed. Error: ${err}`)
    }
  )

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function (err, decode) {
      if (err) req.user = undefined
      req.user = decode
      next()
    })
  } else {
    req.user = undefined
    next()
  }
})
var routes = require('./routes/todoListRoutes')
routes(app)

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
})

app.listen(port)

console.log('todo list RESTful API server started on: ' + port)

module.exports = app
