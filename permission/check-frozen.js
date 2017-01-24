module.exports = function(req) {
  var userInfo = req.session.userInfo
  var agent = require('../db/models/agent')
  var frozen_agent = require('../db/models/frozen_agent')
  return Promise.resolve().then(() => {
    if (userInfo) {
      return agent.findOne({
        where: {
          user_account: userInfo.name
        }
      }).then((result) => {
        return frozen_agent.findOne({
          where: {
            agent_guid: result.guid
          }
        })
      }).then((result) => {
        if (result) {
          req.session.userInfo = undefined
        }
      })
    }
  })
}
