var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var team = sequelize.define(
    'team', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true },
        brand:Sequelize.STRING,
        code:{ type: Sequelize.STRING,primaryKey: true  },
        name:Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = team
