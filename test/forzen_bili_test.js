var should = require('should')

var role_permission = require('../db/models/role_permission')
var permission = require('../db/models/permission')
var agent = require('../db/models/agent')
var agent_brand_role = require('../db/models/agent_brand_role')
var brand_role = require('../db/models/brand_role')
var employable_rule = require('../db/models/employable_rule')

describe('forzen_bili_test', () => {
  // 初始化数据
  before(function() {
    this.timeout(10000)

    return Promise.all([
      role_permission.findOne({
        where: {
          role_code: "user",
          permission_code: "frozen"
        }
      }),
      permission.findOne({
        where: {
          code: "frozen",
          name: "frozen"
        }
      }),

    ]).then((result) => {
      if (result[0] == null && result[1] == null) {
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

  describe('getOperableLevels', () => {
    it('get all can be frozen levels', () => {
      return testfunction("getOperableLevels").then((result) => {
        result.length.should.equal(4)
        result[0].brand_role_name.should.equal("总代理")
        result[0].number.should.equal(0)
      })
    })
  })

})
