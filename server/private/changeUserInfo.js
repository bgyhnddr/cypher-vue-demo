var exec = {
  checkPwd(req, res, next) {
    var pwd = req.body.pwd
    var user_account = req.body.user_account

    var user = require('../../db/models/user')

    return user.findOne({
      where: {
        account: user_account,
        password: pwd
      }
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("输入密码错误")
      } else {
        return true
      }
    })
  },
  changeWechat(req, res, next) {
    var user_account = req.body.user_account
    var wechat = req.body.wechat

    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')

    return agent_detail.findOne({
      where: {
        key: "wechat",
        value: wechat
      }
    }).then(function(result) {
      if (result != null) {
        return Promise.reject("该微信号已被注册，请重新输入")
      } else {
        return agent.findOne({
          where: {
            user_account: user_account
          }
        }).then(function(result) {
          if (result == null) {
            return Promise.reject("修改微信号失败")
          } else {
            return agent_detail.findOne({
              where: {
                agent_guid: result.guid,
                key: 'wechat'
              }
            }).then(function(result) {
              if (result == null) {
                return Promise.reject("修改微信号失败")
              } else {
                result.value = wechat
                return result.save()
              }
            }).then(function(result) {
              return true
            })
          }
        })
      }
    })
  },
  changeCellphone(req, res, next) {
    var user_account = req.session.userInfo.name
    var cellphone = req.body.cellphone

    var user = require('../../db/models/user')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')

    user.hasOne(agent)
    agent.hasMany(agent_detail)

    return agent_detail.findAll({
      where: {
        $and: {
          key: "cellphone",
          value: cellphone
        }
      }
    }).then((result) => {
      if (result.length > 0) {
        return Promise.reject("电话已存在")
      } else {
        return result
      }
    }).then(() => {
      return user.findOne({
        include: {
          model: agent,
          include: {
            model: agent_detail,
            where: {
              key: "cellphone"
            }
          }
        },
        where: {
          account: user_account
        }
      })
    }).then((result) => {
      if (result != null) {
        var ad = result.agent.agent_details[0]
        ad.value = cellphone
        return ad.save()
      } else {
        return Promise.reject("查找个人信息出错，请再尝试")
      }
    }).then(function() {
      return true
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
