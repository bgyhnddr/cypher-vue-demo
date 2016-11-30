var pmp_server = require('../pmp_server')
var exec = {
  showPack(req, res, next) {
    var packcode = req.body.packcode

    return pmp_server.show_pack(packcode)
  },
  packSoldBy(req, res, next) {
    var packcode = req.body.packcode

    var user_account = req.session.userInfo.name

    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')

    agent.hasMany(agent_detail)

    return agent.findOne({
      where: {
        user_account: user_account
      },
      include: [{
        model: agent_detail
      }]
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("获取您的个人资料读取出错")
      } else {
        var who = null
        for (var index in result.agent_details) {
          if (result.agent_details[index].key == "name") {
            who = result.agent_details[index].value
          }
        }
        return pmp_server.pack_sold_by(packcode,who)
      }
    })
  }

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
