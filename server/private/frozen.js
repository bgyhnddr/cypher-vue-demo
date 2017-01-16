var exec = {
  
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
    }).then((result) => {
      if (result) {
        return frozen_agent.destroy({
          where: {
            agent_guid: agent
          }
        }).then((result) => {
          return "OK"
        })
      } else {
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
