var should = require('should')
var role_permission = require('../db/models/role_permission')
var permission = require('../db/models/permission')
var user = require('../db/models/user')
var user_role = require('../db/models/user_role')
var employment = require('../db/models/employment')
var employment_detail = require('../db/models/employment_detail')
var agent = require('../db/models/agent')
var agent_detail = require('../db/models/agent_detail')
var agent_brand_role = require('../db/models/agent_brand_role')
var frozen_agent = require('../db/models/frozen_agent')

describe('frozen-test', () => {
  before(function() {
    this.timeout(10000)
      // runs before all tests in this block
    return role_permission.findOne({
      where: {
        role_code: "user",
        permission_code: "frozen"
      }
    }).then((result) => {
      if (result == null) {
        return Promise.all([
          role_permission.create({
            role_code: "user",
            permission_code: "frozen"
          }),
          permission.create({
            code: "frozen",
            name: "frozen"
          })
        ])
      }
    }).then((result) => {
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
          brand_role_code: "brand_role4"
        }),
        employment.create({
          publish_employment_guid: guid,
          employer_user_account: "admin",
          brand_role_code: "brand_role4",
          brand_guid: "brand1",
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
            value: "frozentester"
          }, {
            employment_guid: result.guid,
            key: 'wechat',
            value: "frozenWechat"
          }, {
            employment_guid: result.guid,
            key: 'cellphone',
            value: "frozenphone"
          }, {
            employment_guid: result.guid,
            key: 'IDType',
            value: "身份证"
          }, {
            employment_guid: result.guid,
            key: 'IDNumber',
            value: "123123"
          }, {
            employment_guid: result.guid,
            key: 'address',
            value: "北京市 北京市市辖区 东城区"
          }, {
            employment_guid: result.guid,
            key: 'addressDetail',
            value: "123123"
          }])
        }),
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
          value: "frozenMember"
        }, {
          agent_guid: guid,
          key: 'wechat',
          value: "frozenWechat"
        }, {
          agent_guid: guid,
          key: 'cellphone',
          value: "frozenphone"
        }, {
          agent_guid: guid,
          key: 'IDType',
          value: "身份证"
        }, {
          agent_guid: guid,
          key: 'IDNumber',
          value: "123123"
        }, {
          agent_guid: guid,
          key: 'address',
          value: "北京市 北京市市辖区 东城区"
        }, {
          agent_guid: guid,
          key: 'addressDetail',
          value: "123123"
        }]),
        frozen_agent.create({
          agent_guid: "321"
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
      return require('../server/private/frozen')({
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
  describe('getFrozenLevels', () => {
    it('get all forzen levels', () => {
      return testfunction("getFrozenLevels").then((result) => {
        result.length.should.equal(4)
        result[0].brand_role_name.should.equal("总代理")
      })
    })
  })
  describe('getFrozenMembers', () => {
    it('get frozen members', () => {
      return testfunction("getFrozenMembers", {
        roleCode: "brand_role4"
      }).then((result) => {
         result.length.should.equal(1)
      })
    })
  })
  describe('FrozenAgent', () => {
    it('frozen agent', () => {
      return testfunction("FrozenAgent", {
        agent: "123"
      }).then((result) => {
        result.should.equal('OK')
      })
    })
    it('frozen agent', () => {
      return testfunction("FrozenAgent", {
        agent: "123"
      }).then((result) => {
        result.should.equal('代理已被冻结')
      })
    })
  })
  describe('ThawAgent', () => {
    it('thaw agent frozen', () => {
      return testfunction("ThawAgent", {
        agent: "321"
      }).then((result) => {
        result.should.equal('OK')
      })
    })
    it('thaw agent not_frozen', () => {
      return testfunction("ThawAgent", {
        agent: "321"
      }).then((result) => {
        result.should.equal('代理未被冻结')
      })
    })
  })

})
