var brand = require('./models/brand')
var agent = require('./models/agent')
var agent_brand_role = require('./models/agent_brand_role')
var brand_role = require('./models/brand_role')
var employable_rule = require('./models/employable_rule')
var brand_detail = require('./models/brand_detail')
var brand_employment_meta = require('./models/brand_employment_meta')

module.exports = function() {
    return Promise.all([
        brand.create({ guid: "brand1", name: "adminbrand", register_time: new Date(), company_name: "A公司" }),
        brand_role.create({ code: "brand_role1", brand_guid: "brand1", name: "品牌商", level: "0" }),
        brand_role.create({ code: "brand_role2", brand_guid: "brand1", name: "一级代理", level: "1" }),
        brand_role.create({ code: "brand_role3", brand_guid: "brand1", name: "二级代理", level: "2" }),
        brand_role.create({ code: "brand_role4", brand_guid: "brand1", name: "三级代理", level: "3" }),
        brand_role.create({ code: "brand_role5", brand_guid: "brand1", name: "销售员", level: "4" }),
        agent_brand_role.create({ agent_guid: "agent1", brand_role_code: "brand_role1" }),
        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role2" }),
        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role3" }),
        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role4" }),
        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role5" }),
        agent.create({ user_account: "admin", guid: "agent1" }),
        brand_employment_meta.create({ brand_guid: "brand1", key: "申请人头像", type: "Object", required: true }),
        brand_employment_meta.create({ brand_guid: "brand1", key: "申请人", type: "String", required: true }),
        brand_employment_meta.create({ brand_guid: "brand1", key: "微信号", type: "String", required: true }),
        brand_employment_meta.create({ brand_guid: "brand1", key: "证件类型", type: "List", required: true }),
        brand_employment_meta.create({ brand_guid: "brand1", key: "证件号", type: "String", required: true }),
        brand_employment_meta.create({ brand_guid: "brand1", key: "通讯地址", type: "String", required: true }),
        brand_employment_meta.create({ brand_guid: "brand1", key: "详细地址", type: "String", required: true }),

    ])
}