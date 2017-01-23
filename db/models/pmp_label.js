var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_label = sequelize.define(
  'pmp_label', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    pmp_brand_id: Sequelize.UUID,
    type: Sequelize.STRING,
    name: {
      type: Sequelize.STRING,
      unique: true
    }
  }, {
    underscored: true
  })

module.exports = pmp_label
