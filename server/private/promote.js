require('../../src/extend/date-format').dateformat()

var Sequelize = require('../../db/sequelize')

var exec = {

  /**
   * 获取可提拔可操作等级列表
   * get
   */
  getPromotionOperableLevels(req, res, next) {
    var user_account = req.session.userInfo.name

    var agent = require('../../db/models/agent')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var brand_role = require('../../db/models/brand_role')
    var employable_rule = require('../../db/models/employable_rule')
    var employment = require('../../db/models/employment')

    brand_role.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(agent)
    brand_role.hasMany(employable_rule, {
      foreignKey: 'employer_brand_role_code'
    })
    employable_rule.belongsTo(brand_role, {
      foreignKey: 'employable_brand_role_code'
    })

    return brand_role.findAll({
      include: [{
        model: agent_brand_role,
        include: {
          model: agent,
          where: {
            user_account: user_account
          }
        }
      }, {
        model: employable_rule,
        include: {
          model: brand_role,
          where: {
            level: {
              $gt: Sequelize.col("brand_role.level")
            }
          }
        }
      }]
    }).then(function(result) {
      var employableRules = result[0].employable_rules.filter((employableRule, index) => {
        return index != 0
      }).map(o => o)

      var addEmployment = (account, employeeList, list) => {
        var childList = list.filter(o => o.employer_user_account == account).map(o => o)
        Array.prototype.push.apply(employeeList, childList)
        childList.forEach((o) => {
          addEmployment(o.employee_user_account, employeeList, list)
        })
      }

      return employment.findAll({
        where: {
          status: '已审核',
          audit_result: '已通过'
        }
      }).then((result) => {
        var employeeList = []
        addEmployment(user_account, employeeList, result)
        return employeeList
      }).then((result) => {
        return employableRules.map((employableRuleItem) => {
          return {
            brand_role_code: employableRuleItem.employable_brand_role_code,
            brand_role_name: employableRuleItem.brand_role.name,
            number: result.filter((employmentItem) => {
              return employmentItem.brand_role_code == employableRuleItem.employable_brand_role_code
            }).length
          }
        })
      })
    })

  },
  /**
   * 获取可提拔可操作人员列表
   * get
   */
  getPromotionOperableStaffs(req, res, next) {
    var level = req.query.level
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)
    var user_account = req.session.userInfo.name

    var user = require('../../db/models/user')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var brand_role = require('../../db/models/brand_role')
    var employable_rule = require('../../db/models/employable_rule')
    var employment = require('../../db/models/employment')

    brand_role.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(agent)
    brand_role.hasMany(employable_rule, {
      foreignKey: 'employer_brand_role_code'
    })
    employable_rule.belongsTo(brand_role, {
      foreignKey: 'employable_brand_role_code'
    })
    employment.belongsTo(user, {
      foreignKey: "employee_user_account"
    })
    user.hasOne(agent)
    agent.hasMany(agent_detail)

    return brand_role.findAll({
      include: [{
        model: agent_brand_role,
        include: {
          model: agent,
          where: {
            user_account: user_account
          }
        }
      }, {
        model: employable_rule,
        include: {
          model: brand_role,
          where: {
            level: {
              $gt: Sequelize.col("brand_role.level")
            }
          }
        }
      }]
    }).then((result) => {

      var employableRules = result[0].employable_rules.filter((employmentRule, index) => {
        return index != 0
      }).map(o => o)

      var addEmployment = (account, employeeList, list) => {
        var childList = list.filter(o => o.employer_user_account == account).map(o => o)
        Array.prototype.push.apply(employeeList, childList)
        childList.forEach((o) => {
          addEmployment(o.employee_user_account, employeeList, list)
        })
      }

      return employment.findAll({
        where: {
          status: '已审核',
          audit_result: '已通过'
        },
        order: "employment.created_at DESC",
        include: {
          model: user,
          include: {
            model: agent,
            include: {
              model: agent_detail
            }
          }
        }
      }).then((result) => {
        var employeeList = []
        addEmployment(user_account, employeeList, result)
        return employeeList
      }).then((result) => {
        var filterResult = result

        if(level){
          filterResult = result.filter((employmentItem) => {
            return employmentItem.brand_role_code == level
          })
        }

        if (filterKey != "") {
          filterResult = result.filter((employmentItem) => {
            employmentItem.user.password = "******"

            var hasFilterKeyDetailLists = employmentItem.user.agent.agent_details.filter((detailItem) => {
              if (detailItem.key == "name" || detailItem.key == "cellphone") {
                return detailItem.value.match(filterKey) != null
              }
            }).map(o => o)

            return hasFilterKeyDetailLists.length > 0
          }).map(o => o)
        }

        return {
          end: (count + page * count) >= filterResult.length,
          list: filterResult.filter((Item, index) => {
            return index >= page * count && index < (count + page * count)
          }).map(o => o)
        }
      })
    })
  },
  /**
   * 获取提拔等级列表
   * get
   */
  getLevels(req, res, next) {
    var promoter_user_account = req.session.userInfo.name
    var promotee_user_account = req.query.promotee

    var agent = require('../../db/models/agent')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var brand_role = require('../../db/models/brand_role')
    var employable_rule = require('../../db/models/employable_rule')
    var employment = require('../../db/models/employment')

    brand_role.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(agent)
    brand_role.hasMany(employable_rule, {
      foreignKey: 'employer_brand_role_code'
    })
    employable_rule.belongsTo(brand_role, {
      foreignKey: 'employable_brand_role_code'
    })

    return Promise.all([
      //提拔者的可招募角色
      brand_role.findAll({
        include: [{
          model: agent_brand_role,
          include: {
            model: agent,
            where: {
              user_account: promoter_user_account
            }
          }
        }, {
          model: employable_rule,
          include: {
            model: brand_role,
            where: {
              level: {
                $gt: Sequelize.col("brand_role.level")
              }
            }
          }
        }]
      }),
      //被提拔者的角色
      brand_role.findOne({
        include: {
          model: agent_brand_role,
          include: {
            model: agent,
            where: {
              user_account: promotee_user_account
            }
          }
        }
      })
    ]).then(function(result) {
      var employableRules = result[0][0].employable_rules.filter((employableRule) => {
        return Number(employableRule.brand_role.level) < Number(result[1].level)
      }).map(o => o)

      return employableRules
    })
  },
  /**
   * 创建提拔申请
   * post
   */
  createPromotion(req, res, next) {
    var promoter_user_account = req.session.userInfo.name
    var promotee_user_account = req.body.promotee
    var level = req.body.level

    var user = require('../../db/models/user')
    var agent = require('../../db/models/agent')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var brand_role = require('../../db/models/brand_role')
    var employment = require('../../db/models/employment')
    var agent_promotion = require('../../db/models/agent_promotion')
    var brand = require('../../db/models/brand')

    agent_promotion.belongsTo(user, {
      foreignKey: "promotee_user_account"
    })
    user.hasOne(agent)
    agent.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(brand_role)
    brand_role.belongsTo(brand)

    return agent_promotion.findOne({
      where: {
        promotee_user_account: promotee_user_account,
        status: true
      },
      include: {
        model: user,
        include: {
          model: agent,
          include: {
            model: agent_brand_role,
            include: {
              model: brand_role
            }
          }
        }
      }
    }).then(function(result) {
      if (result != null) {
        if (result.brand_role_code == level && result.promoter_user_account == promoter_user_account) {
          return result.guid
        } else {
          return Promise.reject("该代理已提交提拔审核，请勿再次提拔。请待审核完成后，再次提拔。")
        }
      } else {
        return agent.findOne({
          where: {
            user_account: promoter_user_account
          },
          include: {
            model: agent_brand_role,
            include: {
              model: brand_role,
              include: {
                model: brand
              }
            }
          }
        }).then((result) => {
          return agent_promotion.create({
            brand_guid: result.agent_brand_role.brand_role.brand.guid,
            promoter_user_account: promoter_user_account,
            promotee_user_account: promotee_user_account,
            brand_role_code: level,
            create_time: new Date().Format('yyyy-MM-dd hh:mm'),
            status: true
          }).then(function(result) {
            return result.guid
          })
        })
      }
    })
  },
  /**
   * 获取提拔申请
   * get
   */
  getPromotion(req, res, next) {
    var promotionGuid = req.query.promotionGuid

    var employment = require('../../db/models/employment')
    var agent_promotion = require('../../db/models/agent_promotion')
    var user = require('../../db/models/user')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var brand_role = require('../../db/models/brand_role')

    agent_promotion.hasOne(employment)
    agent_promotion.belongsTo(brand_role, {
      foreignKey: 'brand_role_code'
    })
    agent_promotion.belongsTo(user, {
      foreignKey: 'promoter_user_account'
    })
    user.hasOne(agent)
    agent.hasMany(agent_detail)
    agent.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(brand_role)

    return agent_promotion.findOne({
      where: {
        guid: promotionGuid
      },
      include: [{
        model: employment
      }, {
        model: brand_role
      }, {
        model: user,
        include: {
          model: agent,
          include: [{
            model: agent_detail
          }, {
            model: agent_brand_role,
            include: {
              model: brand_role
            }
          }]
        }
      }]
    }).then(function(result) {
      if (result != null) {
        return result
      } else {
        return Promise.reject("找不到记录")
      }
    })

  },
  /**
   * 被提拔者确认提拔申请
   * post
   */
  confirmPromotion(req, res, next) {
    var promotee_user_account = req.session.userInfo.name
    var promotionGuid = req.body.promotionGuid

    var employment = require('../../db/models/employment')
    var agent_promotion = require('../../db/models/agent_promotion')

    return agent_promotion.findOne({
      where: {
        guid: promotionGuid
      }
    }).then(function(result) {
      if (result != null) {
        result.agree_time = new Date().Format('yyyy-MM-dd hh:mm')
        return result.save().then((result) => {
          var agentPromotion = result
          return employment.findOne({
            where: {
              agent_promotion_guid: result.guid
            }
          }).then((result) => {
            if (result == null) {
              return employment.create({
                agent_promotion_guid: agentPromotion.guid,
                brand_guid: agentPromotion.brand_guid,
                brand_role_code: agentPromotion.brand_role_code,
                employer_user_account: agentPromotion.promoter_user_account,
                employee_user_account: agentPromotion.promotee_user_account,
                employer_time: agentPromotion.agree_time,
                status: true,
              })
            } else {
              return Promise.reject("该提拔已确认")
            }
          })
        })
      } else {
        return Promise.reject("找不到记录")
      }
    })

  },

  /**
   * 获取提拔审核列表
   * GET
   */
  getPromotelist(req, res, next) {
    var brand_role = require('../../db/models/brand_role')
    var user = require('../../db/models/user')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var agent_promotion = require('../../db/models/agent_promotion')

    agent_promotion.belongsTo(brand_role, {
      foreignKey: 'brand_role_code'
    })
    agent_promotion.belongsTo(user, {
      foreignKey: 'promotee_user_account'
    })
    user.hasOne(agent)
    agent.hasMany(agent_detail)


    var selectMsg = req.query.key
    var select = "create_time desc"

    if (selectMsg != null) {
      switch (selectMsg) {
        case "timeasc":
          select = "create_time asc"
          break
        case "timedesc":
          select = "create_time desc"
          break
        case "leveldesc":
          select = "brand_role_code asc"
          break
        case "levelasc":
          select = "brand_role_code desc"
      }
    }

    return agent_promotion.findAll({
      where: {
        status: 1
      },
      include: [brand_role, {
        model: user,
        include: {
          model: agent,
          include: agent_detail
        }
      }],
      order: select
    }).then((result) => {
      return result.map((a) => {
        obj = a.toJSON()
        obj.user.agent.agent_detail = {}
        obj.user.agent.agent_details.forEach((d) => {
          obj.user.agent.agent_detail[d.key] = d.value
        })
        delete obj.user.agent.agent_details
        return obj
      })
    })
  },
  /**
   * 获取提拔审核代理信息
   * GET
   */
  getPromoteAuditInfo(req, res, next) {
    var account = req.query.account
    var user = require('../../db/models/user')
    var brand = require('../../db/models/brand')
    var brand_role = require('../../db/models/brand_role')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var agent_promotion = require('../../db/models/agent_promotion')
    var agent_brand_role = require('../../db/models/agent_brand_role')

    agent_promotion.belongsTo(user, {
      foreignKey: 'promoter_user_account'
    })
    agent_promotion.belongsTo(agent, {
      foreignKey: 'guid'
    })
    brand_role.belongsTo(brand)
    agent_promotion.belongsTo(brand_role)
    user.hasOne(agent)
    agent.hasMany(agent_detail)
    agent.hasOne(agent_brand_role)


    return agent_promotion.findOne({
      where: {
        status: 1,
        promotee_user_account: account
      },
      include: [{
        model: brand_role,
        include:brand
      }, {
        model: agent,
        include: agent_detail
      }, {
        model: user,
        include: [{
          model: agent,
          include: [{
            model: agent_detail
          }]
        }]
      }]
    }).then((result) => {
      obj = result.toJSON()
      obj.agent.agent_detail = {}
      obj.agent.agent_details.forEach((d) => {
        obj.agent.agent_detail[d.key] = d.value
      })
      obj.user.agent.agent_detail = {}
      obj.user.agent.agent_details.forEach((d) => {
        obj.user.agent.agent_detail[d.key] = d.value
      })
      delete obj.agent.agent_details
      delete obj.user.agent.agent_details
      return obj
    })
  },
  /**
   * 通过提拔审核
   * GET
   */
  PassPromote(req, res, next) {

  },
  /**
   * 拒绝提拔审核
   * GET
   */
  RejectPromote(req, res, next) {

  },


}

module.exports = (req, res, next) => {
  var action = req.params.action
  return Promise.resolve(action).then(function(result) {
    return exec[result](req, res, next)
  }).then(function(result) {
    return res.send(result)
  }).catch(function(error) {
    return res.status(500).send(error.toString())
  })
}
