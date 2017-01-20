var should = require('should')
var role_permission = require('../db/models/role_permission')
var employment = require('../db/models/employment')
var permission = require('../db/models/permission')
var user = require('../db/models/user')
var user_role = require('../db/models/user_role')
var agent = require('../db/models/agent')
var agent_detail = require('../db/models/agent_detail')
var agent_brand_role = require('../db/models/agent_brand_role')
var frozen_agent = require('../db/models/frozen_agent')

require('../src/extend/date-format').dateformat()

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

      return agent_detail.findOne({
        where: {
          key: 'name',
          value: 'frozenMember'
        }
      }).then((result) => {
        if (result == null) {
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
        }
      })
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
        roleCode: "brand_role4",
        filterKey: ""
      }).then((result) => {
        result.length.should.equal(1)
      })
    })
  })

  describe('getFrozenMembers', () => {
    it('get frozen members with filter-name', () => {
      return testfunction("getFrozenMembers", {
        roleCode: "brand_role4",
        filterKey: "frozenMember"
      }).then((result) => {
        result.length.should.equal(1)
      })
    })
  })

  describe('getFrozenMembers', () => {
    it('get frozen members with filter-phone', () => {
      return testfunction("getFrozenMembers", {
        roleCode: "brand_role4",
        filterKey: "frozenphone"
      }).then((result) => {
        result.length.should.equal(1)
      })
    })
  })

  describe('FrozenAgent', () => {
    it('froze frozen', () => {
      return frozen_agent.findAll({
        where: {
          agent_guid: "123"
        }
      }).then((o) => {
        return testfunction("FrozenAgent", {
          agent: "123"
        }).then((result) => {
          if (o.length > 0) {
            result.should.equal('代理已被冻结')
          } else {
            result.should.equal('OK')
          }
        })
      })

    })
  })
  describe('ThawAgent', () => {
    it('thaw frozen', () => {
      return frozen_agent.findAll({
        where: {
          agent_guid: "321"
        }
      }).then((o) => {
        return testfunction("ThawAgent", {
          agent: "321"
        }).then((result) => {
          if (o.length > 0) {
            result.should.equal('OK')
          } else {
            result.should.equal('代理未被冻结')
          }
        })

      })
    })
  })

})
