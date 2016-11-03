var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var publish_employment = sequelize.define(
    'publish_employment', {
        guid: { type: Sequelize.UUID, primaryKey: true, unique: true },
        brand_guid: Sequelize.STRING,
        brand_role_code: Sequelize.STRING,
        employer_user_account: Sequelize.STRING,
        create_time: Sequelize.DATE,
        status: { type: Sequelize.BOOLEAN, comment: "可填：false 结束，true 开始" }
    }, {
        underscored: true
    })


module.exports = publish_employment