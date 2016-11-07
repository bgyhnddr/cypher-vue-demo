var brand = require('./models/brand')
var agent = require('./models/agent')
var agent_brand_role = require('./models/agent_brand_role')
var brand_role = require('./models/brand_role')
var employable_rule = require('./models/employable_rule')
var brand_detail = require('./models/brand_detail')
var employment = require('./models/employment')
var employment_detail = require('./models/employment_detail')
var employment_term = require('./models/employment_term')
var agent_detail = require('./models/agent_detail')

module.exports = function() {
    return Promise.all([
        brand.create({ guid: "brand1", name: "adminbrand" }),

        brand_role.create({ code: "brand_role1", brand_guid: "brand1", name: "品牌商", level: "0" }),
        brand_role.create({ code: "brand_role2", brand_guid: "brand1", name: "一级代理", level: "1" }),
        brand_role.create({ code: "brand_role3", brand_guid: "brand1", name: "二级代理", level: "2" }),
        brand_role.create({ code: "brand_role4", brand_guid: "brand1", name: "三级代理", level: "3" }),
        brand_role.create({ code: "brand_role5", brand_guid: "brand1", name: "销售员", level: "4" }),

        agent_brand_role.create({ agent_guid: "agent1", brand_role_code: "brand_role1" }),
        agent_brand_role.create({ agent_guid: "agent2", brand_role_code: "brand_role2" }),

        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role2" }),
        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role3" }),
        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role4" }),
        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role5" }),

        employable_rule.create({ employer_brand_role_code: "brand_role2", employable_brand_role_code: "brand_role3" }),
        employable_rule.create({ employer_brand_role_code: "brand_role2", employable_brand_role_code: "brand_role4" }),
        employable_rule.create({ employer_brand_role_code: "brand_role2", employable_brand_role_code: "brand_role5" }),

        agent.create({ user_account: "bili", guid: "agent1" }),
        agent.create({ user_account: "bili2", guid: "agent2" }),

        agent_detail.create({ agent_guid: "agent1", key: "name", value: "张代理" }),
        agent.create({ user_account: "limt", guid: "agent1" }),
        agent.create({ user_account: "admin", guid: "agent1" }),
        //agent_detail.create({ agent_guid: "agent1", key: "name", value: "张代理" }),

        brand_detail.create({ brand_guid: "brand1", key: "headImg", value: "1" }),
        brand_detail.create({ brand_guid: "brand1", key: "name", value: "2" }),
        brand_detail.create({ brand_guid: "brand1", key: "companyName", value: "A公司" }),

        agent_detail.create({ agent_guid: "agent2", key: "name", value: "李xx" }),

        // employment.create({ guid: "ep1", brand_guid: "brand1", brand_role_code: "brand_role2", employer_user_account: "admin", employer_time: new Date(), employee_user_account: "tester1", status: "未审核", audit_user_account: "admin" }),
        // employment.create({ guid: "ep2", brand_guid: "brand1", brand_role_code: "brand_role3", employer_user_account: "admin", employer_time: new Date(), employee_user_account: "tester2", status: "未审核", audit_user_account: "admin" }),
        // employment.create({ guid: "ep3", brand_guid: "brand1", brand_role_code: "brand_role2", employer_user_account: "admin", employer_time: new Date(), employee_user_account: "tester3", status: "未审核", audit_user_account: "admin" }),
        employment.create({ guid: "ep1", brand_guid: "brand1", brand_role_code: "brand_role2", employer_user_account: "limt", employer_time: '2016-09-11 12:30:46', employee_user_account: "tester1", status: "未审核", audit_user_account: "limt" }),
        employment.create({ guid: "ep2", brand_guid: "brand1", brand_role_code: "brand_role3", employer_user_account: "limt", employer_time: '2016-10-11 12:30:46', employee_user_account: "tester2", status: "未审核", audit_user_account: "limt" }),
        employment.create({ guid: "ep3", brand_guid: "brand1", brand_role_code: "brand_role2", employer_user_account: "limt", employer_time: '2016-12-11 12:30:46', employee_user_account: "tester3", status: "未审核", audit_user_account: "limt" }),

        employment_detail.create({ employment_guid: "ep1", key: "agent_detail", value: "boe" }),
        employment_detail.create({ employment_guid: "ep1", key: "wx", value: "wxA" }),
        employment_detail.create({ employment_guid: "ep1", key: "phone", value: "111" }),
        employment_detail.create({ employment_guid: "ep1", key: "address", value: "月球" }),

        employment_detail.create({ employment_guid: "ep2", key: "name", value: "mike" }),
        employment_detail.create({ employment_guid: "ep2", key: "wx", value: "wxB" }),
        employment_detail.create({ employment_guid: "ep2", key: "phone", value: "222" }),
        employment_detail.create({ employment_guid: "ep2", key: "address", value: "火星" }),

        employment_detail.create({ employment_guid: "ep3", key: "name", value: "lucy" }),
        employment_detail.create({ employment_guid: "ep3", key: "wx", value: "wxC" }),
        employment_detail.create({ employment_guid: "ep3", key: "phone", value: "333" }),
        employment_detail.create({ employment_guid: "ep3", key: "address", value: "地球" }),
    ])
}