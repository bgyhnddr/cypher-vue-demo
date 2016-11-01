var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var brand_employment_meta = sequelize.define(
    'brand_employment_meta', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
        brand_guid: Sequelize.STRING, 
        key: Sequelize.STRING,
        type: Sequelize.STRING
    }, {
        underscored: true  
    })


module.exports = brand_employment_meta