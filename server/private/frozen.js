var exec = {

  /**
   * 获取首页可冻结等级列表
   * get
   */
  getFrozenLevels(req, res, next) {
    var user_account = req.session.userInfo.name

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
            }
          }
        }
      }
    }).then(function(result) {
      //TODO: 查找该等级下的链上成员

      if (result.agent_brand_role.brand_role.level == "0" || result.agent_brand_role.brand_role.level == "-1") {
        var frozenLevelsDate = []

        result.agent_brand_role.brand_role.employable_rules.map((employableRule) => {
          frozenLevelsDate.push({
            brand_role_code: employableRule.employable_brand_role_code,
            brand_role_name: employableRule.brand_role.name,
            number: 0
          })
        })

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
        }).then((result) => {

          frozenLevelsDate.map((frozenLevelItem) => {
            var condition = {}
            condition.status = '已审核'
            condition.audit_result = '已通过'
            if (result.length > 0) {

              console.log("frozenLevelItem.brand_role_code" + frozenLevelItem.brand_role_code)

              condition = {
                employee_user_account: {
                  $in: result
                },
                status: '已审核',
                audit_result: '已通过',
                brand_role_code: frozenLevelItem.brand_role_code
              }

              employment.findAll({
                where: condition,
                include: [{
                  model: employment_detail
                }]
              }).then((result) => {
                console.log(result.length)
                frozenLevelItem.frozenLevelNum = result.length
                console.log("frozenLevelItem =" + JSON.stringify(frozenLevelItem))
              })
            } else {
              frozenLevelItem.number = 0
            }
          })


          console.log(JSON.stringify(frozenLevelsDate))
          return frozenLevelsDate

        })

      } else {
        return Promise.reject("not found")
      }


      // return result
    })

  },
  /**
   * 获取可冻结等级人员列表
   * get
   */
  getFrozenStaffOfOneLevel(req, res, next) {
    var user_account = req.session.userInfo.name
    var level = req.query.level

    var employment = require('../../db/models/employment')
    var employment_detail = require('../../db/models/employment_detail')
    var brand_role = require('../../db/models/brand_role')

    employment.hasMany(employment_detail)
    employment.belongsTo(brand_role)

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
    }).then((result) => {
      var condition = {}
      condition.status = '已审核'
      condition.audit_result = '已通过'
      if (result.length > 0) {
        condition = {
          employee_user_account: {
            $in: result
          },
          status: '已审核',
          audit_result: '已通过'
        }
        if (level && level != "all") {
          condition.brand_role_code = level
        }
        return employment.findAll({
          where: condition,
          include: [{
            model: employment_detail
          }]
        })
      } else {
        return []
      }
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
