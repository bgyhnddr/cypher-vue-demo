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


   /*冻结代理
    *post
    */
   FrozenAgent(req, res, next) {
     var agent = req.body.agent
     var frozen_agent = require('../../db/models/frozen_agent')
     return frozen_agent.create({
       agent_guid: agent
     }).then((result) => {
       return "OK"
     })
   },

   /*解冻代理
    *post
    */
   ThawAgent(req, res, next) {
     var agent = req.body.agent
     var frozen_agent = require('../../db/models/frozen_agent')
     return frozen_agent.findOne({
       where: {
         agent_guid: agent
       }
     }).then((result)=>{
       if(result){
         return frozen_agent.destroy({
           where: {
             agent_guid: agent
           }
         }).then((result) => {
           return "OK"
         })
       }else{
         return Promise.reject("代理未被冻结")
       }
     })
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
