var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_brand = sequelize.define(
  'pmp_brand', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    access_token: Sequelize.STRING(128),
    app_key: Sequelize.STRING(18),
    name: Sequelize.STRING,
    company: Sequelize.STRING,
    status: Sequelize.STRING
  }, {
    underscored: true
  })


module.exports = pmp_brand
