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

    agent.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(brand_role)
    brand_role.hasMany(employable_rule, {
      foreignKey: 'employer_brand_role_code',
      constraints: false
    })
    employable_rule.belongsTo(brand_role, {
      foreignKey: 'employable_brand_role_code',
      constraints: false
    })

    return agent.findOne({
      where: {
        user_account: user_account,
      },
      include: {
        model: agent_brand_role,
        include: {
          model: brand_role,
          include: {
            model: employable_rule,
            include: {
              model: brand_role,
              // where: {
              //   level: {
              //     $gt :Sequelize.col('agent.agent_brand_role.brand_role.level')
              //   }
              // }
            }
          }
        }
      }
    }).then(function(result) {
      var promotionLevelsDate = []
      promotionLevelsDate = result.agent_brand_role.brand_role.employable_rules.map((employableRule) => {
        return {
          brand_role_code: employableRule.employable_brand_role_code,
          brand_role_name: employableRule.brand_role.name,
          number: 0
        }
      })

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
        if (result.length > 0) {
          promotionLevelsDate.map((promotionLevelItem) => {
            result.map((employmentItem) => {
              if (employmentItem.brand_role_code == promotionLevelItem.brand_role_code) {
                promotionLevelItem.number++
              }
            })
          })
        }

        return promotionLevelsDate
      })
    })

  },
  /**
   * 获取可操作人员列表
   * get
   */
  getOperableStaffs(req, res, next) {
    var level = req.query.level
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)
    var user_account = req.session.userInfo.name
    var order = req.query.order

    var agent = require('../../db/models/agent')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var brand_role = require('../../db/models/brand_role')
    var employable_rule = require('../../db/models/employable_rule')
    var employment = require('../../db/models/employment')
    var employment_detail = require('../../db/models/employment_detail')

    agent.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(brand_role)
    brand_role.hasMany(employable_rule, {
      foreignKey: 'employer_brand_role_code',
      constraints: false
    })
    employable_rule.belongsTo(brand_role, {
      foreignKey: 'employable_brand_role_code',
      constraints: false
    })
    employment.hasMany(employment_detail)
    employment.belongsTo(brand_role)

    if (filterKey) {
      where.name = {
        $like: "%" + filterKey + "%"
      }
    }

    var orderstring = "created_at DESC"
    if (order) {
      orderstring = order.key + " " + (order.asc ? "" : "DESC")
    }

    var addEmployment = (account, employeeList, list) => {
      var childList = list.filter(o => o.employer_user_account == account).map(o => o.employee_user_account)
      Array.prototype.push.apply(employeeList, childList)
      childList.forEach((o) => {
        addEmployment(o, employeeList, list)
      })
    }

    return employment.findAll().then((result) => {
      var employeeList = []
      addEmployment(user_account, employeeList, result)
      return employeeList
    }).then(function(result) {
      if (result)
        var condition = {}
      condition.status = '已审核'
      condition.audit_result = '已通过'
      return result
    })
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
