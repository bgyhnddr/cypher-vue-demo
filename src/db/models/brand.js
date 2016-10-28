var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var brand = sequelize.define(
    'brand', {
        guid: { type:Sequelize.STRING, primaryKey: true, unique: true },
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        register_time: Sequelize.DATE
    }, {
        underscored: true 
    })


module.exports = brand
