var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var agent = sequelize.define(
    'agent', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
        brand_guid: Sequelize.STRING, 
        user_account: Sequelize.STRING,
        agent_guid: Sequelize.STRING
    }, {
        underscored: true  
    })


module.exports = agent
