var Sequelize = require('sequelize')

var fs = require('fs')
if (!fs.existsSync("db/data")) {
    fs.mkdirSync("db/data")
}
var sequelize = new Sequelize('bleman', 'cypher_admin', 'Cypher2015', {
    dialect: 'mysql',
    host: 'rdssl1u0dsbhp7obuinml.mysql.rds.aliyuncs.com',
    port: 3306
})
module.exports = sequelize