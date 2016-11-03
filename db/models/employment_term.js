var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var employment_term = sequelize.define(
    'employment_term', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
        employment_guid: Sequelize.STRING,
        term_from: Sequelize.DATE,
        term_to: Sequelize.DATE
    }, {
        underscored: true
    })


module.exports = employment_term