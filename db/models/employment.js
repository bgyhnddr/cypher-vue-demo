var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var employment = sequelize.define(
    'employment', {
        guid: { type: Sequelize.UUID, primaryKey: true, unique: true },
        publish_employment_guid: Sequelize.STRING,
        brand_guid: Sequelize.STRING,
        brand_role_code: Sequelize.STRING,
        employer_user_account: Sequelize.STRING,
        employer_time: Sequelize.STRING,
        deadline: Sequelize.STRING,
        employee_user_account: Sequelize.STRING,
        status: { type: Sequelize.STRING, comment: "可填：未处理，已通过，已关闭，打回" },
        audit_user_account: Sequelize.STRING,
        audit_time: Sequelize.STRING,
        audit_result: { type: Sequelize.STRING, comment: "可填：成功，失败" },
        reject_reason: Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = employment