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
      if(result != null){
        return Promise.reject("该微信号已被注册，请重新输入")
      }else{
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
    var user_account = req.body.user_account
    var cellphone = req.body.cellphone

    var user = require('../../db/models/user')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var sequelize = require('../../db/sequelize')
    var user_role = require('../../db/models/user_role')

    return agent.findOne({
      where: {
        user_account: user_account
      }
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("查找您的信息出现异常，请稍后再试")
      } else {
        return Promise.all([
          user.findOne({
            where: {
              account: user_account
            }
          }),
          user_role.findOne({
            where: {
              user_account: user_account
            }
          }),
          agent_detail.findOne({
            where: {
              agent_guid: result.guid,
              key: 'cellphone'
            }
          }),
          result,
          //查找是否修改的手机号有相同的account
          user.findOne({
            where: {
              account: cellphone
            }
          }),
        ]).then(function(result) {
          if (result[0] == null || result[1] == null || result[2] == null || result[3] == null) {
            return Promise.reject("查找您的信息出现异常，请稍后再试")
          } else {
            if (result[4] != null) {
              return Promise.reject("您所输入的手机号已被注册，请重新输入")
            } else {
              return sequelize.transaction().then(function(t) {
                return Promise.all([
                  //修改user表 account
                  user.create({
                    account: cellphone,
                    password: result[0].password
                  }, {
                    transaction: t
                  }).then(function(result) {
                    user.destroy({
                      where: {
                        account: user_account
                      }
                    })
                  }),
                  //修改user_role表 user_account
                  result[1].update({
                    user_account: cellphone
                  }, {
                    transaction: t
                  }),
                  //修改agent_detail表中资料的手机号
                  result[2].update({
                    value: cellphone
                  }, {
                    transaction: t
                  }),
                  //修改agent表中资料的手机号
                  result[3].update({
                    user_account: cellphone
                  }, {
                    transaction: t
                  })
                ]).then(function(result) {
                  t.commit()
                  req.session.userInfo.name = cellphone
                  return true
                }).catch(function(err) {
                  // err 是事务回调中使用promise链中的异常结果
                  t.rollback()
                  return Promise.reject("修改手机号失败")
                })

              })
            }
          }
        })
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
