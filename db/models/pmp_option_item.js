var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_option_item = sequelize.define(
  'pmp_option_item', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pmp_specification_option_id: Sequelize.INTEGER,
    name: Sequelize.STRING
  }, {
    underscored: true
  })

module.exports = pmp_option_item
