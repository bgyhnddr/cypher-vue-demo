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

        return agent.findOne({
            where: {
                user_account: user_account
            }
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("获取个人资料读取出错")
            } else {
                return agent_detail.findOne({
                    where: {
                        agent_guid: result.guid,
                        key: 'wechat'
                    }
                }).then(function(result) {
                    if (result == null) {
                        return Promise.reject("获取个人资料读取出错")
                    } else {
                        result.value = wechat
                        return result.save()
                    }
                }).then(function(result) {
                    return true
                })
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