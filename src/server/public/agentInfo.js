var exec = {
    getBrandInfo(req, res, next) {
        var user_account = req.body.user_account

        var agent = require('../../db/models/agent')

        return agent.findOne({
            attributes: ['agent_guid'],
            where:{
                user_account: user_account
            }
        }).then(function(result){
            var agent_brand_role = require('../../db/models/agent_brand_role')
            var brand_role = require('../../db/models/brand_role')

            brand_role.hasOne(agent_brand_role, {
                foreignKey: 'brand_role_code',
                constraints: false
            })
            return brand_role.findOne({
                include: [{
                    model: agent_brand_role,
                    where: {
                        agent_guid: result.agent_guid
                    }
                }]
            })
        }).then(function(result){
            if(result == null){
                return Promise.reject("找不到你的品牌商信息")
            } else {
                return result
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