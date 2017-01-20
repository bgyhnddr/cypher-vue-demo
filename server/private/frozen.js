var Sequelize = require('../../db/sequelize')

var CheckRole = function(user) {
  var agent = require('../../db/models/agent')
  var agent_brand_role = require('../../db/models/agent_brand_role')
  agent.hasOne(agent_brand_role)
  return agent.findOne({
    where: {
      user_account: user
    },
    include: agent_brand_role
  }).then((result) => {
    return result.agent_brand_role.brand_role_code
  })
}

var exec = {

  /**
   * 获取冻结等级列表
   * get
   */
  getFrozenLevels(req, res, next) {
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
      var frozenLevelsData = []
      var employableRules = result[0].employable_rules

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
  /*获取冻结成员列表
   *post
   */
  getFrozenMembers(req, res, next) {
    var roleCode = req.query.roleCode
    var filterKey = req.query.filterKey
    var user = req.session.userInfo.name
    var filterAccount = undefined
    var filterRole = undefined
    var employment = require('../../db/models/employment')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var brand_role = require('../../db/models/brand_role')
    var frozen_agent = require('../../db/models/frozen_agent')

    agent_brand_role.belongsTo(brand_role)
    agent.hasOne(agent_brand_role)
    agent.hasMany(agent_detail)
    agent.hasOne(frozen_agent)

    var addEmployment = (account, employeeList, list) => {
      var childList = list.filter(o => o.employer_user_account == account).map(o => o.employee_user_account)
      Array.prototype.push.apply(employeeList, childList)
      childList.forEach((o) => {
        addEmployment(o, employeeList, list)
      })
    }

    if (filterKey != "") {
      filterAccount = {
        $or: [{
          key: 'cellphone',
          value: filterKey
        }, {
          key: 'name',
          value: filterKey
        }]
      }
    }
    if (roleCode) {
      filterRole = {
        brand_role_code: roleCode
      }
    }

    return employment.findAll({
      where: {
        status: '已审核',
        audit_result: '已通过'
      }
    }).then((result) => {
      var employeeList = []
      addEmployment(user, employeeList, result)
      return agent.findAll({
        where: {
          user_account: {
            $in: employeeList
          }
        },
        include: [frozen_agent, {
          model: agent_detail,
          where: filterAccount,
        }, {
          model: agent_brand_role,
          include: brand_role,
          where: filterRole
        }]
      })
    }).then((result) => {
      return result.map((a) => {
        obj = a.toJSON()
        obj.agent_detail = {}
        obj.agent_details.forEach((d) => {
          obj.agent_detail[d.key] = d.value
        })
        delete obj.agent_details
        return obj
      })
    }).then((result) => {
      if (result.length > 0) {
        return result
      } else {
        if (filterKey != "") {
          return Promise.reject("查无此成员")
        } else {
          return Promise.reject("无可冻结成员")
        }
      }
    })
  },

  /*冻结代理
   *post
   */
  FrozenAgent(req, res, next) {
    var agent = req.body.agent
    var user_account = req.session.userInfo.name
    var frozen_agent = require('../../db/models/frozen_agent')

    return new Promise((resolve, reject) => {
      CheckRole(user_account).then((result) => {
        if (result == "brand_role0" || result == "brand_role1") {
          return frozen_agent.findOne({
            where: {
              agent_guid: agent
            }
          }).then((result) => {
            if (result) {
              reject("代理已被冻结")
            } else {
              return frozen_agent.create({
                agent_guid: agent
              }).then((result) => {
                resolve("OK")
              })
            }
          })
        } else {
          reject("权限不足")
        }
      })
    })
  },

  /*解冻代理
   *post
   */
  ThawAgent(req, res, next) {
    var agent = req.body.agent
    var user_account = req.session.userInfo.name
    var frozen_agent = require('../../db/models/frozen_agent')

    return new Promise((resolve, reject) => {
      CheckRole(user_account).then((result) => {
        if (result == "brand_role0" || result == "brand_role1") {
          return frozen_agent.findOne({
            where: {
              agent_guid: agent
            }
          }).then((result) => {
            if (result) {
              return frozen_agent.destroy({
                where: {
                  agent_guid: agent
                }
              }).then((result) => {
                resolve("OK")
              })
            } else {
              reject("代理未被冻结")
            }
          })
        } else {
          reject("权限不足")
        }
      })
    })
  },

  /*检查代理身份
   *GET
   */
  CheckUserRole(req, res, next) {
    var user_account = req.session.userInfo.name
    return CheckRole(user_account)
  }
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
