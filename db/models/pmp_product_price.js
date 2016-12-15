var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_product_price = sequelize.define(
  'pmp_product_price', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pmp_product_id: Sequelize.INTEGER,
    brand_role_code: Sequelize.STRING,
    price: Sequelize.DECIMAL(10, 2),
    price_unit: Sequelize.STRING
  }, {
    underscored: true
  })


module.exports = pmp_product_price
