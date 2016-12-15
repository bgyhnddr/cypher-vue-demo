var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_variant = sequelize.define(
  'pmp_variant', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pmp_product_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    on_sell: Sequelize.BOOLEAN
  }, {
    underscored: true
  })

module.exports = pmp_variant
