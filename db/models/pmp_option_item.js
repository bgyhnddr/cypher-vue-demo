var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_option_item = sequelize.define(
  'pmp_option_item', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_specification_option_id: Sequelize.UUID,
    name: Sequelize.STRING
  }, {
    underscored: true
  })

module.exports = pmp_option_item
