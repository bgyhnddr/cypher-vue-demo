var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var agent = sequelize.define(
    'agent', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true },
        user_account: Sequelize.STRING,
        guid: { type: Sequelize.STRING, primaryKey: true }
    }, {
        underscored: true  
    })


module.exports = agent
