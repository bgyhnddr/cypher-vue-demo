var exec = {
    getBrandInfo(req, res, next) {
        var user_account = req.body.user_account

        var agent = require('../../db/models/agent')
        var agent_brand_role = require('../../db/models/agent_brand_role')
        var brand_role = require('../../db/models/brand_role')
        var brand = require('../../db/models/brand')
        var brand_detail = require('../../db/models/brand_detail')

        brand.hasOne(brand_role)
        brand_role.hasOne(agent_brand_role)
        agent_brand_role.belongsTo(agent)
        brand.hasMany(brand_detail)

        return brand.findOne({
            include: [{
                model: brand_role,
                include: [{
                    model: agent_brand_role,
                    include: [{
                        model: agent,
                        where: {
                            user_account: user_account
                        },
                    }],
                }],
            }]
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("找不到您的品牌商角色")
            } else {
                return brand.findOne({
                    where: {
                        guid: result.guid,
                    },
                    include: [{
                        model: brand_detail,
                    }],
                }).then(function(result) {
                    if (result == null) {
                        return Promise.reject("找不到您的品牌商资料")
                    } else {
                        return result
                    }
                })
            }
        })
    },
    submitApplication(req, res, next) {
        var meta = req.body.meta
        var data = req.body.data
        var date = req.body.date
        var employer = req.body.employer
        var employmentData = req.body.employmentData

        var employment = require('../../db/models/employment')
        var employment_detail = require('../../db/models/employment_detail')

        employment.hasMany(employment_detail)

        return employment.findOne({
            where: {
                brand_guid: employmentData.guid,
                employer_user_account: data.account
            }
        }).then(function(result) {
            if (result != null) {
                return Promise.reject("您已经提交该品牌商的代理申请，请等待回复")
            } else {
                return Promise.reject("您未提交过该品牌商的代理申请，请等待申请")
                    // return Promise.all([
                    //     employment.create({ account: account, password: password }),
                    //     // employment_detail.create({ user_account: account, role_code: 'test_role' })
                    // ])
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