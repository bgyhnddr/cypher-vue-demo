var brand = require('./models/brand')
var agent = require('./models/agent')
var agent_brand_role = require('./models/agent_brand_role')
var brand_role = require('./models/brand_role')
var employable_rule = require('./models/employable_rule')

module.exports = function() {
    return Promise.all([
        brand.create({brand_guid:"brand1",name: "bilibrand", register_time:new Date()}),
        brand_role.create({code:"brand_role1",brand_guid:"brand1",name: "品牌商", level: "0"}),
        brand_role.create({code:"brand_role2",brand_guid:"brand1",name: "总代理", level: "1"}),
        brand_role.create({code:"brand_role3",brand_guid:"brand1",name: "一级代理", level: "2"}),
        brand_role.create({code:"brand_role4",brand_guid:"brand1",name: "二级代理", level: "3"}),
        brand_role.create({code:"brand_role5",brand_guid:"brand1",name: "分销", level: "4"}),
        agent_brand_role.create({agent_guid:"agent1",brand_role_code:"brand_role1"}),
        employable_rule.create({employer_brand_role_code:"agent1",employable_brand_role_code:"brand_role2"}),
        employable_rule.create({employer_brand_role_code:"agent1",employable_brand_role_code:"brand_role3"}),
        employable_rule.create({employer_brand_role_code:"agent1",employable_brand_role_code:"brand_role4"}),
        employable_rule.create({employer_brand_role_code:"agent1",employable_brand_role_code:"brand_role5"}),
        agent.create( {user_account:"bili",agent_guid: "agent1"}),
    ])
}