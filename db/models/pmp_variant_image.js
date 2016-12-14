var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_variant_image = sequelize.define(
  'pmp_variant_image', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pmp_variant_id: Sequelize.INTEGER,
    attachment_id: Sequelize.INTEGER
  }, {
    underscored: true
  })

module.exports = pmp_variant_image
