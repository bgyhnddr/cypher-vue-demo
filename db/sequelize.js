var Sequelize = require('sequelize')

var fs = require('fs')
if (!fs.existsSync("db/data")) {
    fs.mkdirSync("db/data")
}
var sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: 'db/data/database.db',
    logging: false
})
module.exports = sequelize