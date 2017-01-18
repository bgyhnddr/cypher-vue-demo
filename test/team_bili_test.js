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
var agent_promotion = require('../db/models/agent_promotion')

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
        var uuid = require('node-uuid')
        var guidMenber1 = uuid.v1()
        var guidMenber2 = uuid.v1()

        return Promise.all([
          //添加二级代理 testMember，未被提升
          user.create({
            account: guidMenber1,
            password: "123"
          }),
          user_role.create({
            user_account: guidMenber1,
            role_code: 'user'
          }),
          agent.create({
            user_account: guidMenber1,
            guid: guidMenber1
          }),
          agent_brand_role.create({
            agent_guid: guidMenber1,
            brand_role_code: "brand_role3"
          }),
          employment.create({
            publish_employment_guid: guidMenber1,
            employer_user_account: "admin",
            brand_role_code: "brand_role3",
            brand_guid: "brand_guid",
            employee_user_account: guidMenber1,
            employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_user_account: "admin",
            status: "已审核",
            audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_result: "已通过"
          }).then(function(result) {
            agent_detail.bulkCreate([{
              agent_guid: guidMenber1,
              key: 'employer',
              value: "admin"
            }, {
              agent_guid: guidMenber1,
              key: 'headImg',
              value: "1"
            }, {
              agent_guid: guidMenber1,
              key: 'name',
              value: "testMember1"
            }, {
              agent_guid: guidMenber1,
              key: 'wechat',
              value: "testWechat1"
            }, {
              agent_guid: guidMenber1,
              key: 'cellphone',
              value: "testphone1"
            }, {
              agent_guid: guidMenber1,
              key: 'IDType',
              value: "护照"
            }, {
              agent_guid: guidMenber1,
              key: 'IDNumber',
              value: "111111"
            }, {
              agent_guid: guidMenber1,
              key: 'address',
              value: "北京市 北京市市辖区 东城区"
            }, {
              agent_guid: guidMenber1,
              key: 'addressDetail',
              value: "312312312"
            }])
          }),

          //添加二级代理 testMember，正在提升，未被审核
          user.create({
            account: guidMenber2,
            password: "123"
          }),
          user_role.create({
            user_account: guidMenber2,
            role_code: 'user'
          }),
          agent.create({
            user_account: guidMenber2,
            guid: guidMenber2
          }),
          agent_brand_role.create({
            agent_guid: guidMenber2,
            brand_role_code: "brand_role3"
          }),
          employment.create({
            agent_promotion_guid:guidMenber2,
            brand_guid: "brand_guid",
            brand_role_code: "brand_role3",
            employer_user_account: "admin",
            employee_user_account: guidMenber2,
            employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_user_account: "admin",
            status: "已审核",
            audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_result: "已通过"
          }).then(function(result) {
            agent_detail.bulkCreate([{
              agent_guid: guidMenber2,
              key: 'employer',
              value: "admin"
            }, {
              agent_guid: guidMenber2,
              key: 'headImg',
              value: "1"
            }, {
              agent_guid: guidMenber2,
              key: 'name',
              value: "test1Member2"
            }, {
              agent_guid: guidMenber2,
              key: 'wechat',
              value: "testWechat2"
            }, {
              agent_guid: guidMenber2,
              key: 'cellphone',
              value: "testphone2"
            }, {
              agent_guid: guidMenber2,
              key: 'IDType',
              value: "护照"
            }, {
              agent_guid: guidMenber2,
              key: 'IDNumber',
              value: "222222"
            }, {
              agent_guid: guidMenber2,
              key: 'address',
              value: "北京市 北京市市辖区 东城区"
            }, {
              agent_guid: guidMenber2,
              key: 'addressDetail',
              value: "312312312"
            }])
          }),
          agent_promotion.create({
            guid: guidMenber2,
            promotioner_user_account: guidMenber2,
            promotionee_user_account: "admin",
            brand_role_code:"brand_role2",
            status: true,
            create_time: new Date().Format('yyyy-MM-dd hh:mm'),
          })
          //添加二级代理 testMember，已被被提升
        ])

        console.log("添加普通招募者，未被提升 testMember")
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
    it('get all can be promotion levels', () => {
      return testfunction("getPromotionOperableLevels").then((result) => {
        console.log(JSON.stringify(result))
        result.length.should.equal(3)
        result[0].brand_role_code.should.equal("brand_role3")
        result[0].number.should.be.above(0)
      })
    })
  })

  describe('getPromotionOperableStaffs', () => {
    it('get all can be promotion Staffs', () => {
      return testfunction("getPromotionOperableStaffs", {
        level: "brand_role3",
        filterKey: "test1",
      }).then((result) => {
        result.list.length.should.be.equal(1)
        result.end.should.equal(true)
      })
    })
  })

})
