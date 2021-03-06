﻿var user = require('./models/user')
var user_role = require('./models/user_role')
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
var team = require('./models/team')
var team_agent = require('./models/team_agent')
var team_num = require('./models/team_num')

module.exports = function() {
    return Promise.all([
        user.create({ account: 'admin', password: "admin" }), //品牌商

        user_role.create({ user_account: "admin", role_code: "user" }),

        brand.create({ guid: "brand1", name: "贝利龙" }),

        brand_role.create({ code: "brand_role0", brand_guid: "brand1", name: "品牌商", level: "-1" }),
        brand_role.create({ code: "brand_role1", brand_guid: "brand1", name: "品牌商", level: "0" }),
        brand_role.create({ code: "brand_role2", brand_guid: "brand1", name: "总代理", level: "1" }),
        brand_role.create({ code: "brand_role3", brand_guid: "brand1", name: "二级代理", level: "2" }),
        brand_role.create({ code: "brand_role4", brand_guid: "brand1", name: "特约销售员", level: "3" }),
        brand_role.create({ code: "brand_role5", brand_guid: "brand1", name: "销售员", level: "4" }),

        agent.create({ user_account: "admin", guid: "agent1" }),

        agent_brand_role.create({ agent_guid: "agent1", brand_role_code: "brand_role1" }),

        employable_rule.create({ employer_brand_role_code: "brand_role0", employable_brand_role_code: "brand_role2" }),
        employable_rule.create({ employer_brand_role_code: "brand_role0", employable_brand_role_code: "brand_role3" }),
        employable_rule.create({ employer_brand_role_code: "brand_role0", employable_brand_role_code: "brand_role4" }),
        employable_rule.create({ employer_brand_role_code: "brand_role0", employable_brand_role_code: "brand_role5" }),

        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role2" }),
        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role3" }),
        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role4" }),
        employable_rule.create({ employer_brand_role_code: "brand_role1", employable_brand_role_code: "brand_role5" }),

        employable_rule.create({ employer_brand_role_code: "brand_role2", employable_brand_role_code: "brand_role3" }),
        employable_rule.create({ employer_brand_role_code: "brand_role2", employable_brand_role_code: "brand_role4" }),
        employable_rule.create({ employer_brand_role_code: "brand_role2", employable_brand_role_code: "brand_role5" }),

        employable_rule.create({ employer_brand_role_code: "brand_role3", employable_brand_role_code: "brand_role4" }),
        employable_rule.create({ employer_brand_role_code: "brand_role3", employable_brand_role_code: "brand_role5" }),

        employable_rule.create({ employer_brand_role_code: "brand_role4", employable_brand_role_code: "brand_role5" }),

        brand_detail.create({ brand_guid: "brand1", key: "companyName", value: "广州市贝利龙发展有限公司" }),
        brand_detail.create({ brand_guid: "brand1", key: "servicesPhone", value: "400-9999-633" }),

        agent_detail.create({ agent_guid: "agent1", key: "name", value: "孙源" }),
        agent_detail.create({ agent_guid: "agent1", key: "wechat", value: "weSunYuan" }),
        agent_detail.create({ agent_guid: "agent1", key: "cellphone", value: "13326699111" }),
        agent_detail.create({ agent_guid: "agent1", key: "IDType", value: "身份证" }),
        agent_detail.create({ agent_guid: "agent1", key: "IDNumber", value: "440402198902202564" }),
        agent_detail.create({ agent_guid: "agent1", key: "address", value: "北京市 北京市市辖区 东城区" }),
        agent_detail.create({ agent_guid: "agent1", key: "addressDetail", value: "中山路52号2栋1单元808" }),
        agent_detail.create({ agent_guid: "agent1", key: "headImg", value: "1" }),

        team.create({ brand:'B',code:'AAA' }),
        team_num.create({ num:0 }),
        team_agent.create({ agent_guid:'agent1',team_code:'AAA',num:'0001' })

    ])
}
