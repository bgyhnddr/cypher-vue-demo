var express = require('express')
var config = require('../config')

var serverEntry = require('../server/entry')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port

var app = express()
serverEntry(app)

app.use("/", function(req, res, next) {
  var cres = {
    send: console.log,
    status: (code) => {
      console.log(code)
      return cres
    }
  }
  var testfunction = (action, params) {
    require('./pmp/commodity')({
      params: {
        action
      },
      query: params
    }, cres)
  }

  testfunction("getCommoditys", {
    filterKey: "",
    page: "0",
    count: "10"
  })
})

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Testing at http://localhost:' + port + '\n')
})
