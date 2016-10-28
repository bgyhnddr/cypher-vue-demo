var exec = {
    getEmployableRoles(req, res, next) {
        var brand_role_code = req.body.brand_role_code
        return brand_role_code
        // var user_account = req.body.user_account

        // var agent = require('../../db/models/agent')
        // var agent_brand_role = require('../../db/models/agent_brand_role')
        // var brand_role = require('../../db/models/brand_role')
        // var brand = require('../../db/models/brand')

        // brand.hasOne(brand_role,{
        //     foreignKey: 'brand_guid',
        //     constraints: false
        // })
        // brand_role.hasOne(agent_brand_role,{
        //     foreignKey: 'brand_role_code',
        //     constraints: false
        // })
        // agent_brand_role.belongsTo(agent,{
        //     foreignKey: 'agent_guid',
        //     constraints: false
        // })

        // return brand.findOne({
        //         include: [{
        //             model: brand_role, 
        //             include:[{
        //                 model: agent_brand_role,
        //                 include:[{
        //                     model: agent,
        //                      where: {
        //                         user_account: user_account
        //                     },
        //                 }],
        //             }],
        //         }]
        //     }).then(function(result) {
        //         if (result == null) {
        //             return Promise.reject("找不到您的品牌商角色")
        //         } else {
        //             return result
        //         }
        //     })
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