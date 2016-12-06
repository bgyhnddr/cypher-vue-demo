var Sequelize = require('sequelize')

var fs = require('fs')
if (!fs.existsSync("db/data")) {
    fs.mkdirSync("db/data")
}
var sequelize = new Sequelize('bleman', 'blemanadm', 'Build2016', {
    dialect: 'mysql',
    host: 'rdssl1u0dsbhp7obuinml.mysql.rds.aliyuncs.com',
    port: 3306,
    timezone: '+8:00'
})
module.exports = sequelize