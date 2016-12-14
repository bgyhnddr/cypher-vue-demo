var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_product_label = sequelize.define(
  'pmp_product_label', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pmp_product_id: Sequelize.INTEGER,
    label_id: Sequelize.INTEGER
  }, {
    underscored: true
  })

module.exports = pmp_product_label
