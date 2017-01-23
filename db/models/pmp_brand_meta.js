var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_brand_meta = sequelize.define(
  'pmp_brand_meta', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_brand_id: Sequelize.UUID,
    key: Sequelize.STRING,
    value: Sequelize.STRING
  }, {
    underscored: true
  })


module.exports = pmp_brand_meta
