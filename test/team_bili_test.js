require('../src/extend/date-format').dateformat()

var uuid = require('node-uuid')
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
var agent_promotion = require('../db/models/agent_promotion')
var frozen_agent = require('../db/models/frozen_agent')

var guidMember1 = "guidMember1"
var guidMember2 = "guidMember2"
var guidMember3 = "guidMember3"

describe('team_bili_test', () => {
  // 初始化数据
  before(function() {
    this.timeout(10000)

    return Promise.all([
      employment,
      agent_promotion,
      frozen_agent
    ].map((o) => o.sync({
      force: true
    }))).then((result) => {
      return role_permission.findOne({
        where: {
          role_code: "user",
          permission_code: "promote"
        }
      }).then((result) => {
        if (result == null) {
          return Promise.all([
            role_permission.create({
              role_code: "user",
              permission_code: "promote"
            }),
            permission.create({
              code: "promote",
              name: "promote"
            })
          ])
          console.log("添加promote promission")
        }
      }).then(() => {

        return Promise.all([
          //添加二级代理 成员一，已发提拔申请，未确认
          user.findOne({
            where: {
              account: guidMember1
            }
          }).then((result) => {
            employment.create({
              publish_employment_guid: guidMember1,
              employer_user_account: "admin",
              brand_role_code: "brand_role3",
              brand_guid: "brand1",
              employee_user_account: guidMember1,
              employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_user_account: "admin",
              status: "已审核",
              audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_result: "已通过"
            })
            agent_promotion.create({
              guid: guidMember1,
              promoter_user_account: "admin",
              promotee_user_account: guidMember1,
              brand_role_code: "brand_role2",
              brand_guid: "brand1",
              status: true,
              create_time: new Date().Format('yyyy-MM-dd hh:mm'),
            })
            if (result == null) {
              Promise.all([
                user.create({
                  account: guidMember1,
                  password: "123"
                }),
                user_role.create({
                  user_account: guidMember1,
                  role_code: 'user'
                }),
                agent.create({
                  user_account: guidMember1,
                  guid: guidMember1
                }),
                agent_brand_role.create({
                  agent_guid: guidMember1,
                  brand_role_code: "brand_role3"
                }),
                agent_detail.bulkCreate([{
                  agent_guid: guidMember1,
                  key: 'employer',
                  value: "admin"
                }, {
                  agent_guid: guidMember1,
                  key: 'headImg',
                  value: "1"
                }, {
                  agent_guid: guidMember1,
                  key: 'name',
                  value: "成员一"
                }, {
                  agent_guid: guidMember1,
                  key: 'wechat',
                  value: "testWechat1"
                }, {
                  agent_guid: guidMember1,
                  key: 'cellphone',
                  value: "13111111111"
                }, {
                  agent_guid: guidMember1,
                  key: 'IDType',
                  value: "护照"
                }, {
                  agent_guid: guidMember1,
                  key: 'IDNumber',
                  value: "111111"
                }, {
                  agent_guid: guidMember1,
                  key: 'address',
                  value: "北京市 北京市市辖区 东城区"
                }, {
                  agent_guid: guidMember1,
                  key: 'addressDetail',
                  value: "312312312"
                }]),

              ])
            }
          }),
          //添加二级代理 成员二，正在提升，未被审核
          user.findOne({
            where: {
              account: guidMember2
            }
          }).then((result) => {
            employment.create({
              publish_employment_guid:guidMember2,
              brand_guid: "brand1",
              brand_role_code: "brand_role3",
              employer_user_account: "admin",
              employee_user_account: guidMember2,
              employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_user_account: "admin",
              status: "已审核",
              audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_result: "已通过"
            })
            employment.create({
              agent_promotion_guid: guidMember2,
              brand_guid: "brand1",
              brand_role_code: "brand_role2",
              employer_user_account: "admin",
              employee_user_account: guidMember2,
              employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
              status: "未审核",
            })
            agent_promotion.create({
              guid: guidMember2,
              promoter_user_account: "admin",
              promotee_user_account: guidMember2,
              brand_role_code: "brand_role2",
              brand_guid: "brand1",
              status: true,
              create_time: new Date().Format('yyyy-MM-dd hh:mm'),
            })
            if (result == null) {
              Promise.all([
                user.create({
                  account: guidMember2,
                  password: "123"
                }),
                user_role.create({
                  user_account: guidMember2,
                  role_code: 'user'
                }),
                agent.create({
                  user_account: guidMember2,
                  guid: guidMember2
                }),
                agent_brand_role.create({
                  agent_guid: guidMember2,
                  brand_role_code: "brand_role3"
                }),
                agent_detail.bulkCreate([{
                  agent_guid: guidMember2,
                  key: 'employer',
                  value: "admin"
                }, {
                  agent_guid: guidMember2,
                  key: 'headImg',
                  value: "1"
                }, {
                  agent_guid: guidMember2,
                  key: 'name',
                  value: "成员二"
                }, {
                  agent_guid: guidMember2,
                  key: 'wechat',
                  value: "testWechat2"
                }, {
                  agent_guid: guidMember2,
                  key: 'cellphone',
                  value: "13222222222"
                }, {
                  agent_guid: guidMember2,
                  key: 'IDType',
                  value: "护照"
                }, {
                  agent_guid: guidMember2,
                  key: 'IDNumber',
                  value: "222222"
                }, {
                  agent_guid: guidMember2,
                  key: 'address',
                  value: "北京市 北京市市辖区 东城区"
                }, {
                  agent_guid: guidMember2,
                  key: 'addressDetail',
                  value: "312312312"
                }])

              ])
            }
          }),
          //添加销售员 成员三,未被提拔
          user.findOne({
            where: {
              account: guidMember3
            }
          }).then((result) => {
            employment.create({
              agent_promotion_guid: guidMember3,
              brand_guid: "brand1",
              brand_role_code: "brand_role5",
              employer_user_account: "admin",
              employee_user_account: guidMember3,
              employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_user_account: "admin",
              status: "已审核",
              audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_result: "已通过"
            })
            if (result == null) {
              Promise.all([
                user.create({
                  account: guidMember3,
                  password: "123"
                }),
                user_role.create({
                  user_account: guidMember3,
                  role_code: 'user'
                }),
                agent.create({
                  user_account: guidMember3,
                  guid: guidMember3
                }),
                agent_brand_role.create({
                  agent_guid: guidMember3,
                  brand_role_code: "brand_role5"
                }),
                agent_detail.bulkCreate([{
                  agent_guid: guidMember3,
                  key: 'employer',
                  value: "admin"
                }, {
                  agent_guid: guidMember3,
                  key: 'headImg',
                  value: "1"
                }, {
                  agent_guid: guidMember3,
                  key: 'name',
                  value: "成员三"
                }, {
                  agent_guid: guidMember3,
                  key: 'wechat',
                  value: "testWechat3"
                }, {
                  agent_guid: guidMember3,
                  key: 'cellphone',
                  value: "13333333333"
                }, {
                  agent_guid: guidMember3,
                  key: 'IDType',
                  value: "护照"
                }, {
                  agent_guid: guidMember3,
                  key: 'IDNumber',
                  value: "333333"
                }, {
                  agent_guid: guidMember3,
                  key: 'address',
                  value: "北京市 北京市市辖区 东城区"
                }, {
                  agent_guid: guidMember3,
                  key: 'addressDetail',
                  value: "312312312"
                }])
              ])
            }
          }),

        ])

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
      return require('../server/private/promote')({
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
    it('get all can be operable promotion levels', () => {
      return testfunction("getPromotionOperableLevels").then((result) => {
        // console.log(JSON.stringify(result))
        result.length.should.equal(3)
        result[0].brand_role_code.should.equal("brand_role3")
        result[0].number.should.be.above(0)
      })
    })
  })

  describe('getPromotionOperableStaffs', () => {
    it('get not level , filterKey="成员"', () => {
      return testfunction("getPromotionOperableStaffs", {
        filterKey: "成员",
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.list.length.should.be.equal(3)
        result.end.should.equal(true)
      })
    })
    it('get get level="brand_role3",not filterKey', () => {
      return testfunction("getPromotionOperableStaffs", {
        level: "brand_role3"
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.list.length.should.be.equal(2)
        result.end.should.equal(true)
      })
    })
  })

  describe('getLevels', () => {
    it('get staff can be promoted Levels，promotee is guidMember2（二级代理）', () => {
      return testfunction("getLevels", {
        promotee: guidMember2
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.length.should.be.equal(1)
        result[0].brand_role.level.should.be.equal("1")
      })
    })
  })

  describe('createPromotion', () => {
    it('guidMember2 已有未审核提拔申请', () => {
      return testfunction("createPromotion", {
        promotee: guidMember2,
        level: "brand_role2"
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.should.be.equal(guidMember2)
      })
    })

    it('promotee is guidMember3（销售员）提拔至 特约销售员', () => {
      return testfunction("createPromotion", {
        promotee: guidMember3,
        level: "brand_role4"
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.should.be.String()
        result.should.match(/-/)
      })
    })
  })

  describe('getPromotion', () => {
    it('get promotion guid = guidMember2, 有未审核记录', () => {
      return testfunction("getPromotion", {
        promotionGuid: guidMember2,
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.promotee_user_account.should.be.equal(guidMember2)
      })
    })

    it('get promotion guid = guidMember1, 未确认提拔申请', () => {
      return testfunction("getPromotion", {
        promotionGuid: guidMember1,
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.promotee_user_account.should.be.equal(guidMember1)
      })
    })
  })

})
