var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')

var getClientAddress = function(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0] ||
    req.connection.remoteAddress;
}
module.exports = (app) => {
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: false
  }))

  // parse application/json
  app.use(bodyParser.json())

  app.use(session({
    secret: '1234567890QWERTY'
  }))

  app.use('/pmp/:type/:action/:token', function(req, res, next) {
    console.log(getClientAddress(req) + " request:" + req.originalUrl)
    try {
      require('./pmp/' + req.params.type)(req, res, next)
    } catch (e) {
      console.log(e)
      res.status(500).send(e.toString())
    }
  })
}
