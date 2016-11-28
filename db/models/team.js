var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var team = sequelize.define(
    'team', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true,primaryKey: true  },
        brand:Sequelize.STRING,
        code:Sequelize.STRING,
        name:Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = team
