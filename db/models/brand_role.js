var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var brand_role = sequelize.define(
    'brand_role', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true },
        code: { type: Sequelize.STRING, primaryKey: true },
        brand_guid: Sequelize.STRING,
        name: Sequelize.STRING,
        level: Sequelize.STRING,
        description: Sequelize.STRING,
        deposit: Sequelize.STRING,
    }, {
        underscored: true
    })


module.exports = brand_role
