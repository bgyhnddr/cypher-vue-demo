var Sequelize = require('sequelize')

var fs = require('fs')
if (!fs.existsSync("db/data")) {
    fs.mkdirSync("db/data")
}
var sequelize = new Sequelize('bleman', 'root', '1234', {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    timezone: '+8:00'
})
module.exports = sequelize