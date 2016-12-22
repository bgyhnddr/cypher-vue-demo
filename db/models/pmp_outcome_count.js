var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_outcome_count = sequelize.define(
  'pmp_outcome_count', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_specification_id: Sequelize.UUID,
    goods_code: Sequelize.STRING,
    counter_user_account: Sequelize.STRING,
    count_time: Sequelize.DATE,
    detial_id: Sequelize.UUID,
    pmp_outcome_count_id: Sequelize.UUID
  }, {
    underscored: true
  })

module.exports = pmp_outcome_count
