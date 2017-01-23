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
var brand_role_meta = require('../db/models/brand_role_meta')

var guidMember1 = "guidMember1"
var guidMember2 = "guidMember2"
var guidMember3 = "guidMember3"
var guidMember4 = "guidMember4"
var guidMember5 = "guidMember5"
var guidMember6 = "guidMember6"
var guidMember7 = "guidMember7"


describe('team_bili_test', () => {
  // 初始化数据
  before(function() {
    this.timeout(20000)

    return Promise.all([
      employment,
      agent_promotion,
      frozen_agent,
      brand_role_meta
    ].map((o) => o.sync({
      force: true
    }))).then((result) => {
      brand_role_meta.bulkCreate([{
        brand_role_code: "brand_role2",
        key: "initialFee",
        value: "50",
        type: "float"
      }, {
        brand_role_code: "brand_role3",
        key: "initialFee",
        value: "50.1",
        type: "float"
      }, {
        brand_role_code: "brand_role4",
        key: "initialFee",
        value: "50.1",
        type: "float"
      }, {
        brand_role_code: "brand_role5",
        key: "initialFee",
        value: "50",
        type: "float"
      }])

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
        }
      }).then(() => {

        return Promise.all([
          //添加二级代理 成员一 无提拔
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
                  value: "test1"
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
          //添加特约销售员代理 成员二，正在提拔至二级代理，未被审核
          user.findOne({
            where: {
              account: guidMember2
            }
          }).then((result) => {
            employment.create({
              publish_employment_guid: guidMember2,
              brand_guid: "brand1",
              brand_role_code: "brand_role4",
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
              brand_role_code: "brand_role3",
              employer_user_account: "admin",
              employee_user_account: guidMember2,
              employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
              status: "未审核",
            })
            agent_promotion.create({
              guid: guidMember2,
              promoter_user_account: "admin",
              promotee_user_account: guidMember2,
              brand_role_code: "brand_role3",
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
                  brand_role_code: "brand_role4"
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
                  value: "test2"
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
              publish_employment_guid: guidMember3,
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
                  value: "test3"
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

          //添加待通过募审核 成员四
          user.findOne({
            where: {
              account: guidMember4
            }
          }).then((result) => {
            employment.create({
              guid: guidMember4,
              publish_employment_guid: guidMember4,
              brand_guid: "brand1",
              brand_role_code: "brand_role5",
              employer_user_account: "admin",
              employee_user_account: guidMember4,
              employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_user_account: "admin",
              status: "未审核"
            })
            if (result == null) {
              Promise.all([
                user.create({
                  account: guidMember4,
                  password: "123"
                }),
                user_role.create({
                  user_account: guidMember4,
                  role_code: 'user'
                }),
                employment_detail.bulkCreate([{
                  employment_guid: guidMember4,
                  key: 'headImg',
                  value: "1"
                }, {
                  employment_guid: guidMember4,
                  key: 'name',
                  value: "成员四"
                }, {
                  employment_guid: guidMember4,
                  key: 'wechat',
                  value: "test4"
                }, {
                  employment_guid: guidMember4,
                  key: 'cellphone',
                  value: "13444444444"
                }, {
                  employment_guid: guidMember4,
                  key: 'IDType',
                  value: "护照"
                }, {
                  employment_guid: guidMember4,
                  key: 'IDNumber',
                  value: "444444"
                }, {
                  employment_guid: guidMember4,
                  key: 'address',
                  value: "北京市 北京市市辖区 东城区"
                }, {
                  employment_guid: guidMember4,
                  key: 'addressDetail',
                  value: "312312312"
                }])
              ])
            }
          }),

          //添加二级代理 成员五，已发提拔申请，已确认
          user.findOne({
            where: {
              account: guidMember1
            }
          }).then((result) => {
            employment.create({
              publish_employment_guid: guidMember5,
              employer_user_account: "admin",
              brand_role_code: "brand_role3",
              brand_guid: "brand1",
              employee_user_account: guidMember5,
              employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_user_account: "admin",
              status: "已审核",
              audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_result: "已通过"
            })
            agent_promotion.create({
              guid: guidMember5,
              promoter_user_account: "admin",
              promotee_user_account: guidMember5,
              brand_role_code: "brand_role2",
              brand_guid: "brand1",
              status: true,
              create_time: new Date().Format('yyyy-MM-dd hh:mm'),
            })
            if (result == null) {
              Promise.all([
                user.create({
                  account: guidMember5,
                  password: "123"
                }),
                user_role.create({
                  user_account: guidMember5,
                  role_code: 'user'
                }),
                agent.create({
                  user_account: guidMember5,
                  guid: guidMember5
                }),
                agent_brand_role.create({
                  agent_guid: guidMember5,
                  brand_role_code: "brand_role3"
                }),
                agent_detail.bulkCreate([{
                  agent_guid: guidMember5,
                  key: 'employer',
                  value: "admin"
                }, {
                  agent_guid: guidMember5,
                  key: 'headImg',
                  value: "1"
                }, {
                  agent_guid: guidMember5,
                  key: 'name',
                  value: "成员五"
                }, {
                  agent_guid: guidMember5,
                  key: 'wechat',
                  value: "test5"
                }, {
                  agent_guid: guidMember5,
                  key: 'cellphone',
                  value: "13555555555"
                }, {
                  agent_guid: guidMember5,
                  key: 'IDType',
                  value: "护照"
                }, {
                  agent_guid: guidMember5,
                  key: 'IDNumber',
                  value: "555555"
                }, {
                  agent_guid: guidMember5,
                  key: 'address',
                  value: "北京市 北京市市辖区 东城区"
                }, {
                  agent_guid: guidMember5,
                  key: 'addressDetail',
                  value: "312312312"
                }]),

              ])
            }
          }),

          //添加二级代理 成员六，已发提拔申请，已确认
          user.findOne({
            where: {
              account: guidMember6
            }
          }).then((result) => {
            employment.create({
              publish_employment_guid: guidMember6,
              employer_user_account: "admin",
              brand_role_code: "brand_role3",
              brand_guid: "brand1",
              employee_user_account: guidMember6,
              employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_user_account: "admin",
              status: "已审核",
              audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_result: "已通过"
            })
            agent_promotion.create({
              guid: guidMember6,
              promoter_user_account: "admin",
              promotee_user_account: guidMember6,
              brand_role_code: "brand_role2",
              brand_guid: "brand1",
              status: true,
              create_time: new Date().Format('yyyy-MM-dd hh:mm'),
            })
            if (result == null) {
              Promise.all([
                user.create({
                  account: guidMember6,
                  password: "123"
                }),
                user_role.create({
                  user_account: guidMember6,
                  role_code: 'user'
                }),
                agent.create({
                  user_account: guidMember6,
                  guid: guidMember6
                }),
                agent_brand_role.create({
                  agent_guid: guidMember6,
                  brand_role_code: "brand_role3"
                }),
                agent_detail.bulkCreate([{
                  agent_guid: guidMember6,
                  key: 'employer',
                  value: "admin"
                }, {
                  agent_guid: guidMember6,
                  key: 'headImg',
                  value: "1"
                }, {
                  agent_guid: guidMember6,
                  key: 'name',
                  value: "成员六"
                }, {
                  agent_guid: guidMember6,
                  key: 'wechat',
                  value: "test6"
                }, {
                  agent_guid: guidMember6,
                  key: 'cellphone',
                  value: "13666666666"
                }, {
                  agent_guid: guidMember6,
                  key: 'IDType',
                  value: "护照"
                }, {
                  agent_guid: guidMember6,
                  key: 'IDNumber',
                  value: "666666"
                }, {
                  agent_guid: guidMember6,
                  key: 'address',
                  value: "北京市 北京市市辖区 东城区"
                }, {
                  agent_guid: guidMember6,
                  key: 'addressDetail',
                  value: "312312312"
                }]),

              ])
            }
          }),

          //添加销售员 成员七，未提拔 属于成员一下属
          user.findOne({
            where: {
              account: guidMember7
            }
          }).then((result) => {
            employment.create({
              publish_employment_guid: guidMember7,
              employer_user_account: guidMember1,
              brand_role_code: "brand_role5",
              brand_guid: "brand1",
              employee_user_account: guidMember7,
              employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_user_account: "admin",
              status: "已审核",
              audit_time: new Date().Format('yyyy-MM-dd hh:mm'),
              audit_result: "已通过"
            })
            if (result == null) {
              Promise.all([
                user.create({
                  account: guidMember7,
                  password: "123"
                }),
                user_role.create({
                  user_account: guidMember7,
                  role_code: 'user'
                }),
                agent.create({
                  user_account: guidMember7,
                  guid: guidMember7
                }),
                agent_brand_role.create({
                  agent_guid: guidMember7,
                  brand_role_code: "brand_role5"
                }),
                agent_detail.bulkCreate([{
                  agent_guid: guidMember7,
                  key: 'employer',
                  value: guidMember1
                }, {
                  agent_guid: guidMember7,
                  key: 'headImg',
                  value: "1"
                }, {
                  agent_guid: guidMember7,
                  key: 'name',
                  value: "成员七"
                }, {
                  agent_guid: guidMember7,
                  key: 'wechat',
                  value: "test7"
                }, {
                  agent_guid: guidMember7,
                  key: 'cellphone',
                  value: "13111111111"
                }, {
                  agent_guid: guidMember7,
                  key: 'IDType',
                  value: "护照"
                }, {
                  agent_guid: guidMember7,
                  key: 'IDNumber',
                  value: "777777"
                }, {
                  agent_guid: guidMember7,
                  key: 'address',
                  value: "北京市 北京市市辖区 东城区"
                }, {
                  agent_guid: guidMember7,
                  key: 'addressDetail',
                  value: "77777777"
                }]),

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

  var promoteTestFunc = (action, params) => {
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

  var employTestFunc = (action, params) => {
    try {
      return require('../server/private/employment')({
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
      return promoteTestFunc("getPromotionOperableLevels").then((result) => {
        // console.log(JSON.stringify(result))
        result.length.should.equal(2)
        result[0].brand_role_code.should.equal("brand_role4")
        result[0].number.should.be.above(0)
      })
    })
  })

  describe('getPromotionOperableStaffs', () => {
    it('get not level , filterKey="成员"', () => {
      return promoteTestFunc("getPromotionOperableStaffs", {
        filterKey: "成员",
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.list.length.should.not.be.equal(0)
        result.end.should.equal(true)
      })
    })
    it('get get level="brand_role4",not filterKey', () => {
      return promoteTestFunc("getPromotionOperableStaffs", {
        level: "brand_role4"
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.list.length.should.not.be.equal(0)
        result.end.should.equal(true)
      })
    })
  })

  describe('getLevels', () => {
    it('get staff can be promoted Levels，promotee is guidMember2特约销售员代理）', () => {
      return promoteTestFunc("getLevels", {
        promotee: guidMember2
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.length.should.be.equal(1)
      })
    })

    it('get staff can be promoted Levels，promotee is guidMember3销售员代理）', () => {
      return promoteTestFunc("getLevels", {
        promotee: guidMember3
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.length.should.be.equal(2)
      })
    })
  })

  describe('createPromotion', () => {
    it('guidMember2 已有未审核提拔申请', () => {
      return promoteTestFunc("createPromotion", {
        promotee: guidMember2,
        level: "brand_role3"
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.should.be.equal(guidMember2)
      })
    })

    it('promotee is guidMember3（销售员）提拔至 特约销售员', () => {
      return promoteTestFunc("createPromotion", {
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
      return promoteTestFunc("getPromotion", {
        promotionGuid: guidMember2,
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.promotee_user_account.should.be.equal(guidMember2)
      })
    })

    it('get promotion guid = guidMember5, 未确认提拔申请', () => {
      return promoteTestFunc("getPromotion", {
        promotionGuid: guidMember5,
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.promotee_user_account.should.be.equal(guidMember5)
      })
    })
    it('get promotion guid = guidMember6, 未确认提拔申请', () => {
      return promoteTestFunc("getPromotion", {
        promotionGuid: guidMember6,
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.promotee_user_account.should.be.equal(guidMember6)
      })
    })
  })

  describe('confirmPromotion', () => {
    it('testMember5 confirm Promotion', () => {
      return promoteTestFunc("confirmPromotion", {
        promotionGuid: guidMember5,
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.agent_promotion_guid.should.be.equal(guidMember5)
        result.status.should.be.equal("未审核")
      })
    })

    it('testMember6 confirm Promotion', () => {
      return promoteTestFunc("confirmPromotion", {
        promotionGuid: guidMember6,
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.agent_promotion_guid.should.be.equal(guidMember6)
        result.status.should.be.equal("未审核")
      })
    })
  })

  describe('PassPromote', () => {
    it('pass testMember5 promote', () => {
      return promoteTestFunc("PassPromote", {
        account: guidMember5,
      }).then((result) => {
        return new Promise((resolve, reject) => {
          return employment.findOne({
            where: {
              employee_user_account: guidMember5,
              agent_promotion_guid: {
                $not: null
              }
            }
          }).then((e) => {
            resolve(e)
          })
        }).then((o) => {
          o.status.should.be.equal("已审核")
          o.audit_result.should.be.equal("已通过")
        })
      })
    })
  })

  describe('RejectPromote', () => {
    it('reject testMember6 promote', () => {
      return promoteTestFunc("RejectPromote", {
        account: guidMember6,
        reason: '123'
      }).then((result) => {
        return new Promise((resolve, reject) => {
          return employment.findOne({
            where: {
              employee_user_account: guidMember6,
              agent_promotion_guid: {
                $not: null
              }
            }
          }).then((e) => {
            resolve(e)
          })
        }).then((o) => {
          o.status.should.be.equal("已审核")
          o.audit_result.should.be.equal("已拒绝")
        })
      })
    })
  })


  describe('getAuditInfo', () => {
    it('testMember3 get audit info', () => {
      return employTestFunc("getAuditInfo", {
        auditID: guidMember4
      }).then((result) => {
        // console.log(JSON.stringify(result))
        result.brand_role_meta.totleInitialFee.toFixed(1).should.be.equal('250.3')
      })
    })
  })

})
