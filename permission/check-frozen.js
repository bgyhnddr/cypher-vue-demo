module.exports = function(req, res, next) {
  var userInfo = req.session.userInfo
  var agent = require('../db/models/agent')
  var frozen_agent = require('../db/models/frozen_agent')

  return new Promise(function(resolve, reject) {
    agent.findOne({
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
        reject("account_frozened")
      } else {
        resolve()
      }
    })

  })
}
