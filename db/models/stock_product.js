var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var stock_product = sequelize.define(
  'stock_product', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    owner: Sequelize.STRING,
    pmp_specification_id: Sequelize.STRING,
    count: Sequelize.INTEGER
  }, {
    underscored: true
  })

module.exports = stock_product
