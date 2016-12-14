var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_product = sequelize.define(
  'pmp_product', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pmp_brand_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    status: Sequelize.INTEGER,
    description: Sequelize.STRING(511)
  }, {
    underscored: true
  })


module.exports = pmp_product
