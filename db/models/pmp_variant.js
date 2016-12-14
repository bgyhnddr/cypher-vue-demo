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
    status: Sequelize.INTEGER
  }, {
    underscored: true
  })

module.exports = pmp_variant
