var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var frozen_agent = sequelize.define(
    'frozen_agent', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        agent_guid: Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = frozen_agent
