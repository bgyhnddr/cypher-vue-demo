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
          include:{
            model: brand_role,
            include:{
              model: employable_rule,
              include:{
                model: brand_role,
              }
            }
          }
        }
      }).then(function(result) {
        //TODO: 查找该等级下的链上成员
        return result
      })

  },
  /**
   * 获取可冻结等级人员列表
   * get
   */
  //  getFrozenStaffOfOneLevel(req, res, next) {
  //    var user_account = req.session.userInfo.name
  //    var level = req.query.level
  //
  //    var employment = require('../../db/models/employment')
  //    var employment_detail = require('../../db/models/employment_detail')
  //    var brand_role = require('../../db/models/brand_role')
  //
  //    employment_detail.belongsTo(employment)
  //    employment.belongsTo(brand_role)
  //
  //    var addEmployment = (account, employeeList, list) => {
  //      var childList = list.filter(o => o.employer_user_account == account).map(o => o.employee_user_account)
  //      Array.prototype.push.apply(employeeList, childList)
  //      childList.forEach((o) => {
  //        addEmployment(o, employeeList, list)
  //      })
  //    }
  //
  //    return employment.findAll().then((result) => {
  //      var employeeList = []
  //      addEmployment(user_account, employeeList, result)
  //      return employeeList
  //    }).then((result) => {
  //      var condition = {}
  //      condition.status = '已审核'
  //      condition.audit_result = '已通过'
  //      if (result.length > 0) {
  //        condition = {
  //          employee_user_account: {
  //            $in: result
  //          },
  //          status: '已审核',
  //          audit_result: '已通过'
  //        }
  //        if (level && level != "all") {
  //          condition.brand_role_code = level
  //        }
  //        return employment.findAll({
  //          where: condition,
  //          include: [{
  //            model: employment_detail
  //          }, {
  //            model: brand_role
  //          }]
  //        })
  //      } else {
  //        return []
  //      }
  //    })
  //  },


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
