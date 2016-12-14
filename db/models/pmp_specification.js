var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_specification = sequelize.define(
  'pmp_specification', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pmp_variant_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    status: Sequelize.INTEGER
  }, {
    underscored: true
  })

module.exports = pmp_specification
