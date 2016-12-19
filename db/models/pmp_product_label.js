var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_product_label = sequelize.define(
  'pmp_product_label', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_product_id: Sequelize.UUID,
    pmp_label_id: Sequelize.UUID
  }, {
    underscored: true
  })

module.exports = pmp_product_label
