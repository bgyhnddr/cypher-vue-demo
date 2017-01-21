var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var brand_role_meta = sequelize.define(
    'brand_role_meta', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        brand_role_code: Sequelize.STRING,
        key: Sequelize.STRING,
        value: Sequelize.STRING,
        type: Sequelize.STRING//javascript var type
    }, {
        underscored: true
    })


module.exports = brand_role_meta
