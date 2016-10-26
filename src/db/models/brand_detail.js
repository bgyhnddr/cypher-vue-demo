var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var brand_detail = sequelize.define(
    'brand_detail', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
        brand_guid: Sequelize.STRING, 
        key: Sequelize.STRING,
        value: Sequelize.STRING,
        type: Sequelize.STRING
    }, {
        underscored: true  
    })


module.exports = brand_detail
