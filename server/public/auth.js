var exec = {
  login(req, res, next) {
    var account = req.body.account
    var password = req.body.password


    var user = require('../../db/models/user')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var user_role = require('../../db/models/user_role')
    var role = require('../../db/models/role')
    var role_permission = require('../../db/models/role_permission')

    agent.belongsTo(user)
    agent.hasMany(agent_detail)
    user.hasMany(user_role)
    user_role.belongsTo(role)
    role.hasMany(role_permission)
    return agent.findOne({
      include: [{
        model: agent_detail,
        where: {
          $or: [{
            key: 'cellphone',
            value: account
          }, {
            key: 'wechat',
            value: account
          }]
        }
      }, {
        model: user,
        include: {
          model: user_role,
          include: {
            model: role,
            include: role_permission
          }
        }
      }]
    }).then((result) => {
      if (result == null) {
        return Promise.reject("账号不存在")
      } else {
        if (result.user.password != password) {
          return Promise.reject("密码错误")
        } else {
          var permissions = []
          var userInfo = {}
          result.user.user_roles.forEach((o) => {
            o.role.role_permissions.forEach((p) => {
              permissions.push(p.permission_code)
            })
          })
          userInfo.name = result.user.account
          userInfo.permissions = permissions
          req.session.userInfo = userInfo
          return req.session.userInfo
        }
      }
    })
  },
  logout(req, res, next) {
    req.session.userInfo = undefined
  },
  getUser(req, res, next) {
    return req.session.userInfo
  },
  getAccount(req, res, next) {
    return req.session.VerificationInfo
  },
  changePassword(req, res, next) {
    var userInfo = req.session.userInfo
    if (userInfo) {
      var user = require('../../db/models/user')
      return user.findOne({
        where: {
          account: userInfo.name,
          password: req.body.password
        }
      }).then((result) => {
        if (result == null) {
          return Promise.reject("account or password incorrect")
        } else {
          result.password = req.body.newPassword
          return result.save()
        }
      })
    } else {
      return Promise.reject("not login")
    }
  },
  regist(req, res, next) {
    var account = req.body.account
    var password = req.body.password
    var user = require('../../db/models/user')
    var user_role = require('../../db/models/user_role')
    return user.findOne({
      where: {
        account: account
      }
    }).then(function(result) {
      if (result) {
        return Promise.reject("账号已被注册")
      } else {
        return Promise.all([
          user.create({
            account: account,
            password: password
          }),
          user_role.create({
            user_account: account,
            role_code: 'test_role'
          })
        ])
      }
    })
  },
  changeuserpwd(req, res, next) {
    var user = require('../../db/models/user')
    var userinfo = req.session.userInfo
    var oldpwd = req.body.old_password
    var newpwd = req.body.new_password
    if (userinfo) {
      var account = userinfo.name
      return user.findOne({
        where: {
          account: account
        }
      }).then(function(result) {
        if (result.password != oldpwd) {
          return Promise.reject("密码错误")
        } else {
          result.password = newpwd
          return result.save()
        }
      }).then(function() {
        return "success"
      })
    } else {
      return Promise.reject("请先登录")
    }
  },
  CheckUserBrand(req, res, next) {
    var user = req.session.userInfo.name
    var agent = require('../../db/models/agent')
    return agent.findOne({
      where: {
        user_account: user
      }
    }).then(function(result) {
      if (result) {
        return true
      } else {
        return false
      }
    })
  },
  CommitVerification(req, res, next) {
    var phone = req.body.phone
    var code = req.body.code
    var locate = req.body.locate
    var VerificationInfo = req.session.VerificationInfo
    var NowTime = new Date().getTime().toString().substring(0, 10)

    if (VerificationInfo) {
      var codeTime = req.session.VerificationInfo.time
      if (phone == VerificationInfo.phone && code == VerificationInfo.code) {
        if (NowTime - codeTime > 60) {
          return Promise.reject("验证码错误或已过期")
        }
        req.session.VerificationInfo.code = undefined
        return "success"
      } else {
        return Promise.reject("验证码错误或已过期")
      }
    } else {
      return Promise.reject("验证码错误或已过期")
    }
  },
  resetuserpwd(req, res, next) {
    var user = require('../../db/models/user')

    var account = req.body.account
    var pwd = req.body.pwd

    return user.findOne({
      where: {
        account: account
      }
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("账户不存在")
      } else {
        result.password = pwd
        req.session.VerificationInfo = undefined
        return result.save()
      }
    }).then(function() {
      return "success"
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
