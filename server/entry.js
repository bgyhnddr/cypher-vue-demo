var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')

var getClientAddress = function(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0] ||
    req.connection.remoteAddress;
}
module.exports = (app) => {
  app.use('/init', function(req, res, next) {
    var init = require('../db/init')
    init(req, res, next)
  })

  app.use('/', express.static('mp'));


  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: false
  }))

  // parse application/json
  app.use(bodyParser.json())

  app.use(session({
    secret: '1234567890QWERTY'
  }))

  var OAuth = require('wechat-oauth')
  var api = new OAuth('wx9165b89a9a491bf0', 'af55586c61c8ce8900ffa9fa7c3cfb96')
  var WechatAPI = require('wechat-api')
  var wechatapi = new WechatAPI('wx9165b89a9a491bf0', 'af55586c61c8ce8900ffa9fa7c3cfb96')
  app.use('/wechat/:action', function(req, res, next) {
    require('./wechat/wechat-api')(req, res, next, api, wechatapi)
  })

  app.use('/service/:permission/:type/:action', function(req, res, next) {
    console.log(getClientAddress(req) + " request:" + req.originalUrl)
    try {
      if (req.params.permission == "private") {
        var checkPermission = require('../permission/check-permission')
        checkPermission(req, res, next).then(function() {
          require('./private/' + req.params.type)(req, res, next)
        }, function(error) {
          if (error == "not_login") {
            res.status(404).send({
              "code": "not_login",
              "msg": 'not login'
            })
          } else if (error == "no_authorization") {
            res.status(404).send({
              "code": "no_authorization",
              "msg": 'no authorization'
            })
          }
        })
      } else if (req.params.permission == "public") {
        require('./public/' + req.params.type)(req, res, next)
      }
    } catch (e) {
      console.log(e)
      res.status(500).send(e.toString())
    }
  })
}
