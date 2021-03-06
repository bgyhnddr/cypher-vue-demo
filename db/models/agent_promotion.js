var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var agent_promotion = sequelize.define(
    'agent_promotion', {
        guid: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
        promoter_user_account: Sequelize.STRING,
        promotee_user_account: Sequelize.STRING,
        brand_role_code: Sequelize.STRING,
        brand_guid: Sequelize.STRING,
        status: { type: Sequelize.BOOLEAN, comment: "可填：false 结束，true 开始" },
        create_time: Sequelize.STRING,
        agree_time: Sequelize.STRING,
    }, {
        underscored: true
    })


module.exports = agent_promotion
