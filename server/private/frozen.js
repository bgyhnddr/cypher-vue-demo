var exec = {

  /**
   * 获取首页可冻结等级列表
   * get
   */
  getFrozenLevels(req, res, next) {
    var user_account = req.session.userInfo.name
    console.log(JSON.stringify(user_account))

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
            }
          }
        }
      }).then(function(result) {
        console.log("执行")
        console.log(JSON.stringify(result))
        return result
      })

  },
  /**
   * 获取可冻结等级人员列表
   * get
   */



}

module.exports = (req, res, next) => {
  var action = req.params.action
  Promise.resolve(action).then(function(result) {
    return exec[result](req, res, next)
  }).then(function(result) {
    res.send(result)
  }).catch(function(error) {
    res.status(500).send(error.toString())
  })
}
