var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var team_num = sequelize.define(
    'team_num', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true,primaryKey: true  },
        num:Sequelize.INTEGER
    }, {
        underscored: true
    })


module.exports = team_num
