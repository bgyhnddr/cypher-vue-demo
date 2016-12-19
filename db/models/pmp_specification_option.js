var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_specification_option = sequelize.define(
  'pmp_specification_option', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_brand_id: Sequelize.UUID,
    name: Sequelize.STRING
  }, {
    underscored: true
  })

module.exports = pmp_specification_option
