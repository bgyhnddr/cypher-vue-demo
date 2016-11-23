var exec = {
  SendSMS(req, res, next) {
    var url = 'http://sdk4report.eucp.b2m.cn:8080/sdk/SDKService?wsdl'
    var soap = require('soap')
    var mode = req.body.mode
    var cellphone = req.body.cellphone
    var user = require('../../db/models/user')
    var agent = require('../../db/models/agent')
    var employment = require('../../db/models/employment')
    var agent_detail = require('../../db/models/agent_detail')
    var user = require('../../db/models/user')
    var brand_role = require('../../db/models/brand_role')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    agent.belongsTo(user)
    agent.hasMany(agent_detail)
    agent.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(brand_role)
    var args = {
      arg0: "6SDK-EMY-6688-KIXRR",
      arg1: "709394",
      arg2: null,
      arg3: [cellphone],
      arg4: "",
      arg5: null,
      arg6: "GBK",
      arg7: 5,
      arg8: 123
    }
    soap.WSDL.prototype.ignoredNamespaces = ['xs', 'xsd']
    if (mode == "SendVerificationCode") {
      //获取验证码
      return agent.findOne({
        include: [{
          model: agent_detail,
          where: {
            key: 'cellphone',
            value: cellphone
          }
        }]
      }).then(function(result) {
        if (result == null) {
          return Promise.reject("账号不存在")
        } else {
          var Randnum = ""
          var VerificationInfo = {}
          var NowTime = new Date().getTime().toString().substring(0, 10)

          for (var i = 0; i < 6; i++) {
            Randnum += Math.floor(Math.random() * 10);
          }
          args.arg4 = "【分得】验证码：" + Randnum + ",您的账户：" + cellphone + "正在进行密码重置，如非本人操作，切勿将验证码告知他人！唯一热线：400-9999-633"
          return new Promise((resolve, reject) => {
            if (req.session.VerificationInfo) {
              var codeTime = req.session.VerificationInfo.time
              var TimePass = NowTime - codeTime
              if (TimePass < 60) {
                reject(TimePass)
              } else {
                soap.createClient(url, function(err, client) {
                    client.sendSMS(args, function(err, result) {
                      console.log(result)
                      VerificationInfo.phone = cellphone
                      VerificationInfo.code = Randnum
                      VerificationInfo.time = new Date().getTime().toString().substring(0, 10)
                      req.session.VerificationInfo = VerificationInfo
                      console.log(req.session.VerificationInfo)
                      resolve("success")
                    })
                  })
                  // VerificationInfo.phone = cellphone
                  // VerificationInfo.code = Randnum
                  // VerificationInfo.time = new Date().getTime().toString().substring(0, 10)
                  // req.session.VerificationInfo = VerificationInfo
                  // console.log(req.session.VerificationInfo)
                  // resolve("success")
              }
            } else {
              soap.createClient(url, function(err, client) {
                  client.sendSMS(args, function(err, result) {
                    console.log(result)
                    VerificationInfo.phone = cellphone
                    VerificationInfo.code = Randnum
                    VerificationInfo.time = new Date().getTime().toString().substring(0, 10)
                    req.session.VerificationInfo = VerificationInfo
                    console.log(req.session.VerificationInfo)
                    resolve("success")
                  })
                })
                // VerificationInfo.phone = cellphone
                // VerificationInfo.code = Randnum
                // VerificationInfo.time = new Date().getTime().toString().substring(0, 10)
                // req.session.VerificationInfo = VerificationInfo
                // console.log(req.session.VerificationInfo)
                // resolve("success")
            }
          })
        }
      })
    } else if (mode == "SendPassAuditMessage") {
      //发送通过审核短信
      return agent.findOne({
        include: [user, {
          model: agent_detail,
          where: {
            key: 'cellphone',
            value: cellphone
          }
        }, {
          model: agent_brand_role,
          include: brand_role
        }]
      }).then(function(result) {
          args.arg4 = "【分得】尊敬的客户，您的代理资格(" + result.agent_brand_role.brand_role.name + ")已通过审核，账户："+cellphone+"，初始密码：" + result.user.password+"。请及时修改并妥善保管密码。如需帮助，请致电400-9999-633。"
          return new Promise((resolve, reject) => {
            // console.log(args.arg4)
            // resolve("success")
            soap.createClient(url, function(err, client) {
              client.sendSMS(args, function(err, result) {
                console.log(result)
                resolve("success")
              })
            })
          })
      })
    } else if (mode == "SendRejectAuditMessage") {
      var auditID = req.body.auditID
      return employment.findOne({
          where:{
            guid:auditID
          }
      }).then(function(result){
        args.arg4 = "【分得】尊敬的客户，您的代理资格尚未审核通过，原因："+result.reject_reason+"。请联系招募发起人并重新提交资料。如需帮助，请致电400-9999-633。"
        return new Promise((resolve, reject) => {
          // console.log(args.arg4)
          // resolve("success")
          soap.createClient(url, function(err, client) {
            client.sendSMS(args, function(err, result) {
              console.log(result)
              resolve("success")
            })
          })
        })
      })
    }

  },
  GetUserPhone(req, res, next) {
    var userInfo = req.session.userInfo
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')

    agent_detail.belongsTo(agent)

    return agent_detail.findOne({
      where: {
        key: 'cellphone'
      },
      include: [{
        model: agent,
        where: {
          user_account: userInfo.name
        }
      }]
    })

  },
  GetBalance(req, res, next) {
    var soap = require('soap')
    var phone = req.body.cellphone
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
