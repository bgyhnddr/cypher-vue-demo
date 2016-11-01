var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var employment_detail = sequelize.define(
    'employment_detail', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
        employment_guid: Sequelize.STRING, 
        key: Sequelize.STRING,
        value: Sequelize.STRING,
        type: Sequelize.STRING
    }, {
        underscored: true  
    })


module.exports = employment_detail
