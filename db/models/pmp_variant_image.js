var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_variant_image = sequelize.define(
  'pmp_variant_image', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_variant_id: Sequelize.UUID,
    attachment_id: Sequelize.INTEGER
  }, {
    underscored: true
  })

module.exports = pmp_variant_image
