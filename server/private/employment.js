var exec = {
    getEmployableRoles(req, res, next) {
        var brand_role_code = req.body.brand_role_code

        var brand_role = require('../../db/models/brand_role')
        var employable_rule = require('../../db/models/employable_rule')

        employable_rule.belongsTo(brand_role, {
            foreignKey: 'employable_brand_role_code',
            constraints: false
        })

        return Promise.all([
            employable_rule.findAll({
                where: {
                    employer_brand_role_code: brand_role_code,
                },
                include: [{
                    model: brand_role,
                }],
            }),
            employable_rule.count({
                where: {
                    employer_brand_role_code: brand_role_code,
                }
            })
        ]).then(function(result) {
            var employableRoles = result[0]
            var roleCount = result[1]
            return {
                employableRoles: employableRoles,
                roleCount: roleCount
            }
        })

    },
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
    getAuditList(req, res, next) {
        // return req.session.userInfo
        var userinfo = req.session.userInfo
        var employment = require('../../db/models/employment')
        var employment_detail = require('../../db/models/employment_detail')
        var brand_role = require('../../db/models/brand_role')
        var selectMsg = req.body.key
        var select = "employer_time desc"

        if (selectMsg != null) {
            switch (selectMsg) {
                case "timeasc":
                    select = "employer_time asc"
                    break
                case "timedesc":
                    select = "employer_time desc"
                    break
                case "leveldesc":
                    select = "brand_role_code asc"
                    break
                case "levelasc":
                    select = "brand_role_code desc"
            }
        }

        employment_detail.belongsTo(employment)
        employment.hasMany(employment_detail)
        employment.hasOne(employment_detail)
        employment.belongsTo(brand_role)

        if (userinfo) {
            var account = userinfo.name
            return employment.findAll({
                where: {
                    audit_user_account: account,
                    status: "未审核"
                },
                include: [
                    { model: employment_detail },
                    { model: brand_role }
                ],
                order: select
            })
        } else {
            return Promise.reject("请先登录")
        }
    },
    getAuditInfo(req, res, next) {
        var auditID = req.body.auditID
        var brandID = req.body.brandID
        var employment = require('../../db/models/employment')
        var employment_detail = require('../../db/models/employment_detail')
        var brand = require('../../db/models/brand')
        employment_detail.belongsTo(employment)
        employment.belongsTo(brand)
        return employment_detail.findAll({
            include: {
                model: employment,
                where: {
                    guid: auditID
                },
                include: {
                    model: brand,
                    where: {
                        guid: brandID
                    }
                }
            },
        })
    },
    passAudit(req, res, next) {
        var auditID = req.body.auditID
        var term = req.body.term
        var employment = require('../../db/models/employment')
        var employment_term = require('../../db/models/employment_term')

        return Promise.all([
            employment.findOne({
                where: {
                    guid: auditID
                }
            }),
            employment_term.create({
                employment_guid: auditID,
                term_from: new Date(),
                term_to: term
            })
        ]).then(function(result) {
            result[0].status = "已审核"
            result[0].audit_time = new Date()
            result[0].audit_result = "已通过"
            return result[0].save()
        }).then(function() {
            return "success"
        })

    },
    rejectAudit(req, res, next) {
        var auditID = req.body.auditID
        var reason = req.body.reason
        var employment = require('../../db/models/employment')
        return employment.findOne({
            where: {
                guid: auditID
            }
        }).then(function(result) {
            result.status = "已审核"
            result.audit_time = new Date()
            result.audit_result = "已拒绝"
            result.reject_reason = reason
            return result.save()
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