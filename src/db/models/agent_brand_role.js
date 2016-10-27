var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var agent_brand_role = sequelize.define(
    'agent_brand_role', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
        agent_guid: Sequelize.STRING,
        brand_role_code: Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = agent_brand_role