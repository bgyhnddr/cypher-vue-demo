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
    getRoleName(req, res, next) {
        var brand_role_code = req.body.brand_role_code

        var brand_role = require('../../db/models/brand_role')

        return brand_role.findOne({
            where: {
                code: brand_role_code
            }
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("品牌商角色读取出错")
            } else {
                return result
            }
        })

    },
    getAgentInfo(req, res, next) {
        var user_account = req.body.user_account

        var agent = require('../../db/models/agent')
        var agent_detail = require('../../db/models/agent_detail')

        agent.hasMany(agent_detail)

        return agent.findOne({
            where: {
                user_account: user_account
            },
            include: [{
                model: agent_detail
            }]
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("上级授权角色资料读取出错")
            } else {
                return result
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
        var account = req.body.account
        var locate = req.body.locate

        var employment = require('../../db/models/employment')
        var employment_detail = require('../../db/models/employment_detail')
        var brand = require('../../db/models/brand')
        var agent = require('../../db/models/agent')
        var agent_detail = require('../../db/models/agent_detail')
        var agent_brand_role = require('../../db/models/agent_brand_role')
        var employment_term = require('../../db/models/employment_term')

        employment_detail.belongsTo(employment)
        agent_detail.belongsTo(agent)
        agent.hasOne(agent_brand_role)
        agent.hasOne(employment_term)
        employment.belongsTo(brand)

        if (locate == 'audit') {
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
                }
            })
        } else if (locate == 'history' || locate == 'account') {
            return agent_detail.findAll({
                include: [{
                    model: agent,
                    where: {
                        user_account: account
                    },
                    include: [
                        {
                            model: agent_brand_role,
                        },
                        {
                            model: employment_term
                        }
                    ]
                }]
            })
        }

    },
    passAudit(req, res, next) {
        var auditID = req.body.auditID
        var term = req.body.term
        var employment = require('../../db/models/employment')
        var employment_term = require('../../db/models/employment_term')
        var employment_detail = require('../../db/models/employment_detail')
        var user = require('../../db/models/user')
        var user_role = require('../../db/models/user_role')
        var agent = require('../../db/models/agent')
        var agent_detail = require('../../db/models/agent_detail')
        var agent_brand_role = require('../../db/models/agent_brand_role')

        var uuid = require('node-uuid')
        var guid = uuid.v1()

        var createList

        employment_detail.belongsTo(employment)

        return employment.findOne({
            where: {
                guid: auditID
            },
            include: [{
                model: employment_detail
            }]
        }).then(function(result) {
            for (var item in result.employment_details) {
                createList = agent_detail.create({
                    //guid test
                    agent_guid: guid,
                    key: result.employment_details[item]['key'],
                    value: result.employment_details[item]['value']
                })
            }
            return Promise.all([
                employment_term.create({
                    agent_guid: guid,
                    term_from: result.employer_time,
                    term_to: term
                }),
                user.create({
                    account: result.employee_user_account,
                    password: "123"
                }),
                user_role.create({
                    user_account: result.employee_user_account,
                    role_code: "user"
                }),
                agent.create({
                    user_account: result.employee_user_account,
                    //guid test
                    guid: guid
                }),
                agent_brand_role.create({
                    //guid test
                    agent_guid: guid,
                    brand_role_code: result.brand_role_code
                }),
                agent_detail.create({
                    agent_guid: guid,
                    key: 'employer',
                    value: result.employer_user_account
                }),
                createList,
                result.status = "已审核",
                result.audit_time = new Date().toLocaleString(),
                result.audit_result = "已通过",
                result.save()
            ])
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
            result.audit_time = new Date().toLocaleString()
            result.audit_result = "已拒绝"
            result.reject_reason = reason
            return result.save()
        }).then(function() {
            return "success"
        })
    },
    getAuditHistory(req, res, next) {
        // return req.session.userInfo
        var userinfo = req.session.userInfo
        var employment = require('../../db/models/employment')
        var employment_detail = require('../../db/models/employment_detail')
        var brand_role = require('../../db/models/brand_role')

        var level = req.body.level
        var date_from = req.body.date_from
        var date_to = req.body.date_to


        // if (level) {
        //     condition.brand_role_code = level
        // }

        employment_detail.belongsTo(employment)
        employment.hasMany(employment_detail)
        employment.hasOne(employment_detail)
        employment.belongsTo(brand_role)

        if (userinfo) {
            var account = userinfo.name
            var condition = {
                audit_user_account: account,
                status: "已审核",
                audit_result: "已通过"
            }
            if (level && level != "all") {
                condition.brand_role_code = level
            }
            if (date_from) {
                condition.employer_time = {
                    $gt: date_from,
                    $lte: date_to
                }
            }
            return employment.findAll({
                where: condition,
                include: [
                    { model: employment_detail },
                    { model: brand_role }
                ]
            })
        } else {
            return Promise.reject("请先登录")
        }
    },
    createEmployment(req, res, next) {
        var employer = req.body.employer
        var employmentData = req.body.employmentData
        var createTime = req.body.createTime

        var uuid = require('node-uuid')
        var guid = uuid.v1()

        var publish_employment = require('../../db/models/publish_employment')

        publish_employment.create({
            guid: guid,
            brand_guid: employmentData.guid,
            brand_role_code: employer.brand_role_code,
            employer_user_account: employer.user_account,
            create_time: createTime,
            status: true
        })

        return guid
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