var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var pmp_brand = sequelize.define(
  'pmp_brand', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    access_token: Sequelize.STRING(128),
    app_key: Sequelize.STRING(18),
    name: Sequelize.STRING,
    company: Sequelize.STRING,
    status: Sequelize.INTEGER
  }, {
    underscored: true
  })


module.exports = pmp_brand
