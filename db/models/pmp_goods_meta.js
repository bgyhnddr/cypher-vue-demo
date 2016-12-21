var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_goods_meta = sequelize.define(
  'pmp_goods_meta', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_goods_id: Sequelize.UUID,
    key: Sequelize.STRING,
    value: Sequelize.STRING
  }, {
    underscored: true
  })

module.exports = pmp_goods_meta
