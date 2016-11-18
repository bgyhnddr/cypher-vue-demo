var exec = {
  login(req, res, next) {
    var account = req.body.account
    var password = req.body.password

    var user = require('../../db/models/user')

    return user.findOne({
      attributes: ['account', 'password'],
      where: {
        account: account
      }
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("账号不存在或密码错误")
      } else {
        console.log(result.password)
        if (result.password != password) {
          return Promise.reject("账号不存在或密码错误")
        } else {
          var user_role = require('../../db/models/user_role')
          var role_permission = require('../../db/models/role_permission')

          role_permission.belongsTo(user_role, {
            foreignKey: 'role_code',
            targetKey: 'role_code',
            constraints: false
          })
          return role_permission.findAll({
            include: [{
              model: user_role,
              where: {
                user_account: result.account
              }
            }]
          })
        }
      }
    }).then(function(result) {
      if (result != null) {
        var userInfo = {}
        userInfo.name = account
        userInfo.permissions = result.map(o => o.permission_code)
        req.session.userInfo = userInfo
        return req.session.userInfo
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
  GetSMSBalance(req, res, next) {
    var soap = require('soap')
    var phone = req.body.phone
    var url = 'http://sdk4report.eucp.b2m.cn:8080/sdk/SDKService?wsdl'
    var args = {
      arg0: "6SDK-EMY-6688-KIXRR",
      arg1: "709394"
    }
    soap.WSDL.prototype.ignoredNamespaces = ['xs', 'xsd']
    soap.createClient(url, function(err, client) {
      client.getBalance(args, function(err, result) {
        console.log(result)
      })
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
      if(result==null){
        return Promise.reject("账户不存在")
      }else{
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
