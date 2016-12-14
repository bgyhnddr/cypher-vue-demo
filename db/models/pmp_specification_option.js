var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_specification_option = sequelize.define(
  'pmp_specification_option', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pmp_brand_id: Sequelize.INTEGER,
    name: Sequelize.STRING
  }, {
    underscored: true
  })

module.exports = pmp_specification_option
