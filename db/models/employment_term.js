var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var employment_term = sequelize.define(
    'employment_term', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
        agent_guid: Sequelize.STRING,
        term_from: Sequelize.STRING,
        term_to: Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = employment_term