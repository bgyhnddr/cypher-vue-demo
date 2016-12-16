var express = require('express')

var serverEntry = require('../server/pmp-entry')

// default port where dev server listens for incoming traffic
var argv = require('yargs').argv
console.log(argv)
var port = argv.port || 8080

var app = express()
serverEntry(app)

module.exports = app.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})
