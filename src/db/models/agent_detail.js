var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var agent_detail = sequelize.define(
    'agent_detail', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
        agent_guid: Sequelize.STRING, 
        key: Sequelize.STRING,
        value: Sequelize.STRING,
        type: Sequelize.STRING
    }, {
        underscored: true  
    })


module.exports = agent_detail
