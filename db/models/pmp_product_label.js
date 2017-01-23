var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_product_label = sequelize.define(
  'pmp_product_label', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_product_id: {
      type: Sequelize.UUID,
      unique: "plunique"
    },
    pmp_label_id: {
      type: Sequelize.UUID,
      unique: "plunique"
    }
  }, {
    underscored: true
  })

module.exports = pmp_product_label
