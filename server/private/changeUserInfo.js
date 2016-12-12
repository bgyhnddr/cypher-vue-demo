var exec = {
  checkPwd(req, res, next) {
    var pwd = req.body.pwd
    var user_account = req.session.userInfo.name

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
        req.session.checkPwdValue = pwd
        return true
      }
    })
  },
  changeWechat(req, res, next) {
    var user_account = req.session.userInfo.name
    var wechat = req.body.wechat

    var user = require('../../db/models/user')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var employment = require('../../db/models/employment')
    var employment_detail = require('../../db/models/employment_detail')

    user.hasOne(agent)
    agent.hasMany(agent_detail)
    employment.hasMany(employment_detail)
    user.hasMany(employment, {
      foreignKey: 'employee_user_account',
      constraints: false
    })

    return user.findAll({
      include: [{
        model: employment,
        include: [{
          model: employment_detail
        }]
      }, {
        model: agent,
        include: [{
          model: agent_detail
        }]
      }],
      where: {
        $or: [{
          "$`agent.agent_details`.`key`$": "wechat",
          "$`agent.agent_details`.`value`$": wechat
        }, {
          "$`employments`.`status`$": "未审核",
          "$`employments.employment_details`.`key`$": "wechat",
          "$`employments.employment_details`.`value`$": wechat
        }]
      }
    }).then((result) => {
      if (result.length > 0) {
        return Promise.reject("该微信号已存在")
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
              key: "wechat"
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
        ad.value = wechat
        return ad.save()
      } else {
        return Promise.reject("查找个人信息出错，请再尝试")
      }
    }).then(function() {
      req.session.checkPwdValue = null
      return true
    })
  },
  changeCellphone(req, res, next) {
    var user_account = req.session.userInfo.name
    var cellphone = req.body.cellphone

    var user = require('../../db/models/user')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var employment = require('../../db/models/employment')
    var employment_detail = require('../../db/models/employment_detail')

    user.hasOne(agent)
    agent.hasMany(agent_detail)
    employment.hasMany(employment_detail)
    user.hasMany(employment, {
      foreignKey: 'employee_user_account',
      constraints: false
    })

    return user.findAll({
      include: [{
        model: employment,
        include: [{
          model: employment_detail
        }]
      }, {
        model: agent,
        include: [{
          model: agent_detail
        }]
      }],
      where: {
        $or: [{
          "$`agent.agent_details`.`key`$": "cellphone",
          "$`agent.agent_details`.`value`$": cellphone
        }, {
          "$`employments`.`status`$": "未审核",
          "$`employments.employment_details`.`key`$": "cellphone",
          "$`employments.employment_details`.`value`$": cellphone
        }]
      }
    }).then((result) => {
      if (result.length > 0) {
        return Promise.reject("该手机号已存在")
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
      req.session.checkPwdValue = null
      return true
    })
  },
  getCheckPwdSession(req, res, next) {
    var checkPwdValue = req.session.checkPwdValue
    var user_account = req.session.userInfo.name

    var user = require('../../db/models/user')

    return user.findOne({
      where: {
        account: user_account,
        password: checkPwdValue
      }
    }).then(function(result) {
      if (result == null) {
        return false
      } else {
        return true
      }
    })
  },
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
