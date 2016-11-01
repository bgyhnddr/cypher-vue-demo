var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var employable_rule = sequelize.define(
    'employable_rule', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
        employer_brand_role_code: Sequelize.STRING,
        employable_brand_role_code: Sequelize.STRING,
    }, {
        underscored: true
    })


module.exports = employable_rule