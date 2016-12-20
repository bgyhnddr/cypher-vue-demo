var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_product = sequelize.define(
  'pmp_product', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_brand_id: Sequelize.UUID,
    name: Sequelize.STRING,
    on_sell: Sequelize.BOOLEAN,
    description: Sequelize.STRING(511)
  }, {
    underscored: true
  })


module.exports = pmp_product
