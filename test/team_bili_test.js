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

var guidMember1 = uuid.v1()
var guidMember2 = uuid.v1()
var guidMember3 = uuid.v1()

describe('team_bili_test', () => {
  // 初始化数据
  before(function() {
    this.timeout(10000)

    return Promise.all([
      employment,
      agent_promotion
    ].map((o) => o.sync({
      force: true
    }))).then((result) => {
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
          console.log("添加promotion promission")
        }
      }).then(() => {



        return Promise.all([
          //添加二级代理 testMember1，未被提升
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
          employment.create({
            publish_employment_guid: guidMember1,
            employer_user_account: "admin",
            brand_role_code: "brand_role3",
            brand_guid: "brand_guid",
            employee_user_account: guidMember1,
            employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_user_account: "admin",
            status: "已审核",
            audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_result: "已通过"
          }).then(function(result) {
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
              value: "testMember1"
            }, {
              agent_guid: guidMember1,
              key: 'wechat',
              value: "testWechat1"
            }, {
              agent_guid: guidMember1,
              key: 'cellphone',
              value: "testphone1"
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
            }])
          }),
          agent_promotion.create({
            guid: guidMember1,
            promoter_user_account: "admin",
            promotee_user_account: guidMember1,
            brand_role_code: "brand_role2",
            brand_guid: "brand1",
            status: true,
            create_time: new Date().Format('yyyy-MM-dd hh:mm'),
          }),

          //添加二级代理 test1Member2，正在提升，未被审核
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
          employment.create({
            brand_guid: "brand_guid",
            brand_role_code: "brand_role3",
            employer_user_account: "admin",
            employee_user_account: guidMember2,
            employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_user_account: "admin",
            status: "已审核",
            audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_result: "已通过"
          }),
          employment.create({
            agent_promotion_guid: guidMember2,
            brand_guid: "brand_guid",
            brand_role_code: "brand_role2",
            employer_user_account: "admin",
            employee_user_account: guidMember2,
            employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
            status: "未审核",
          }).then(function(result) {
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
              value: "test1Member2"
            }, {
              agent_guid: guidMember2,
              key: 'wechat',
              value: "testWechat2"
            }, {
              agent_guid: guidMember2,
              key: 'cellphone',
              value: "testphone2"
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
          }),
          agent_promotion.create({
            guid: guidMember2,
            promoter_user_account: "admin",
            promotee_user_account: guidMember2,
            brand_role_code: "brand_role2",
            brand_guid: "brand1",
            status: true,
            create_time: new Date().Format('yyyy-MM-dd hh:mm'),
          }),

          //添加销售员 test1Member3
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
          employment.create({
            agent_promotion_guid: guidMember3,
            brand_guid: "brand_guid",
            brand_role_code: "brand_role5",
            employer_user_account: "admin",
            employee_user_account: guidMember3,
            employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_user_account: "admin",
            status: "已审核",
            audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_result: "已通过"
          }).then(function(result) {
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
              value: "test1Member3"
            }, {
              agent_guid: guidMember3,
              key: 'wechat',
              value: "testWechat3"
            }, {
              agent_guid: guidMember3,
              key: 'cellphone',
              value: "testphone3"
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
          })

          //添加二级代理 testMember，已被被提升
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
    it('get level="brand_role3" , filterKey="test1"', () => {
      return testfunction("getPromotionOperableStaffs", {
        level: "brand_role3",
        filterKey: "test1",
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.list.length.should.be.equal(1)
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

  describe('confirmPromotion', () => {
    it('test1Member2 confirm Promotion', () => {
      return testfunction("confirmPromotion", {
        promotionGuid: guidMember2,
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.agent_promotion_guid.should.be.equal(guidMember2)
        result.status.should.be.equal("未审核")
      })
    })
  })

})
