var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_brand_meta = sequelize.define(
  'pmp_brand_meta', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pmp_brand_id: Sequelize.INTEGER,
    key: Sequelize.STRING,
    value: Sequelize.STRING
  }, {
    underscored: true
  })


module.exports = pmp_brand_meta
