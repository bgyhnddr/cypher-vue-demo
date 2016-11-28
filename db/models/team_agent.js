var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var team_agent = sequelize.define(
    'team_agent', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true ,primaryKey: true},
        agent_guid: Sequelize.STRING,
        team_code:Sequelize.STRING,
        num:Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = team_agent
