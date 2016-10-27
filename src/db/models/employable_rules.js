var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var employable_rules = sequelize.define(
    'employable_rules', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
        employer_brand_role_code: Sequelize.STRING,
        employable_brand_role_code: Sequelize.STRING,
    }, {
        underscored: true
    })


module.exports = employable_rules