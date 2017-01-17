require('../src/extend/date-format').dateformat()

var should = require('should')

var user = require('../db/models/user')
var user_role = require('../db/models/user_role')
var role = require('../db/models/role')
var role_permission = require('../db/models/role_permission')
var permission = require('../db/models/permission')
var agent = require('../db/models/agent')
var agent_detail = require('../db/models/agent_detail')
var agent_brand_role = require('../db/models/agent_brand_role')
var brand_role = require('../db/models/brand_role')
var employable_rule = require('../db/models/employable_rule')
var employment = require('../db/models/employment')
var employment_detail = require('../db/models/employment_detail')

describe('team_bili_test', () => {
  // 初始化数据
  before(function() {
    this.timeout(10000)

    return role_permission.findOne({
      where: {
        role_code: "user",
        permission_code: "promotion"
      }
    }).then((result) => {
      if (result == null) {
        return Promise.all([
          role_permission.create({
            role_code: "user",
            permission_code: "promotion"
          }),
          permission.create({
            code: "promotion",
            name: "promotion"
          })
        ])
      }
    }).then(() => {
      var uuid = require('node-uuid')
      var guid = uuid.v1()

      return Promise.all([
        user.create({
          account: guid,
          password: "123"
        }),
        user_role.create({
          user_account: guid,
          role_code: 'user'
        }),
        agent.create({
          user_account: guid,
          guid: guid
        }),
        agent_brand_role.create({
          agent_guid: guid,
          brand_role_code: "brand_role3"
        }),
        employment.create({
          publish_employment_guid: guid,
          employer_user_account: "admin",
          brand_role_code: "brand_role3",
          brand_guid: "brand_guid",
          employee_user_account: guid,
          employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
          audit_user_account: "admin",
          status: "已审核",
          audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
          audit_result: "已通过"
        }).then(function(result) {
          employment_detail.bulkCreate([{
            employment_guid: result.guid,
            key: 'headImg',
            value: "1"
          }, {
            employment_guid: result.guid,
            key: 'name',
            value: "testMember"
          }, {
            employment_guid: result.guid,
            key: 'wechat',
            value: "testWechat"
          }, {
            employment_guid: result.guid,
            key: 'cellphone',
            value: "testphone"
          }, {
            employment_guid: result.guid,
            key: 'IDType',
            value: "护照"
          }, {
            employment_guid: result.guid,
            key: 'IDNumber',
            value: "312312312"
          }, {
            employment_guid: result.guid,
            key: 'address',
            value: "北京市 北京市市辖区 东城区"
          }, {
            employment_guid: result.guid,
            key: 'addressDetail',
            value: "312312312"
          }])
          agent_detail.bulkCreate([{
            agent_guid: guid,
            key: 'employer',
            value: "admin"
          }, {
            agent_guid: guid,
            key: 'headImg',
            value: "1"
          }, {
            agent_guid: guid,
            key: 'name',
            value: "testMember"
          }, {
            agent_guid: guid,
            key: 'wechat',
            value: "testWechat"
          }, {
            agent_guid: guid,
            key: 'cellphone',
            value: "testphone"
          }, {
            agent_guid: guid,
            key: 'IDType',
            value: "护照"
          }, {
            agent_guid: guid,
            key: 'IDNumber',
            value: "312312312"
          }, {
            agent_guid: guid,
            key: 'address',
            value: "北京市 北京市市辖区 东城区"
          }, {
            agent_guid: guid,
            key: 'addressDetail',
            value: "312312312"
          }])
        })
      ])
    })

  })



  var cres = {
    send: function(text) {
      return text
    },
    status: (code) => {
      console.log(code)
      return {
        send: function(text) {
          return text
        }
      }
    }
  }

  var testfunction = (action, params) => {
    try {
      return require('../server/private/promotion')({
        session: {
          userInfo: {
            name: "admin"
          }
        },
        params: {
          action
        },
        query: params,
        body: params
      }, cres)
    } catch (e) {
      console.log(e)
    }
  }

  describe('getPromotionOperableLevels', () => {
    it('get all can be promotion levels', () => {
      return testfunction("getPromotionOperableLevels").then((result) => {
        result.length.should.equal(4)
        result[0].brand_role_name.should.equal("总代理")
        result[1].number.should.be.above(0)
      })
    })
  })

})
