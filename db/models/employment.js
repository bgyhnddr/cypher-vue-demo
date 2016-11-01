var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var employment = sequelize.define(
    'employment', {
        guid: { type: Sequelize.STRING, primaryKey: true, unique: true },
        brand_guid: Sequelize.STRING, 
        employer_user_account: Sequelize.STRING,
        employer_time: Sequelize.DATE,
        deadline: Sequelize.DATE,
        employee_user_account: Sequelize.STRING,
        status:{ type: Sequelize.STRING,  comment: "可填：未处理，已通过，已关闭，打回" },
        audit_user_account: Sequelize.STRING,
        audit_time: Sequelize.DATE,
        audit_result: { type: Sequelize.STRING,  comment: "可填：成功，失败" },
        reject_reason: Sequelize.STRING
    }, {
        underscored: true  
    })


module.exports = employment
