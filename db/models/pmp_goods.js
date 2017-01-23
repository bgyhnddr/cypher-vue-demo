var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_goods = sequelize.define(
  'pmp_goods', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_specification_id: Sequelize.UUID,
    goods_code: {
      type: Sequelize.STRING,
      unique: true
    },
    pmp_outcome_count_id: Sequelize.UUID,
    status: {
      type: Sequelize.STRING,
      defaultValue: "PRO"
    },
    resell_user_account: Sequelize.STRING,
    owner_user_account: Sequelize.STRING,
    seller_user_account: Sequelize.STRING,
    sold_time: Sequelize.DATE
  }, {
    underscored: true
  })

module.exports = pmp_goods
