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
    getRoleName(req, res, next) {
        var brand_guid = req.body.brand_guid
        var brand_role_code = req.body.brand_role_code

        var brand_role = require('../../db/models/brand_role')

        return brand_role.findOne({
            where: {
                brand_guid: brand_guid,
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
    submitApplication(req, res, next) {
        var meta = req.body.meta
        var data = req.body.data
        var employmentData = req.body.employmentData
        var deadline = req.body.deadline

        var uuid = require('node-uuid')
        var guid = uuid.v1()
        var employment = require('../../db/models/employment')
        var employment_detail = require('../../db/models/employment_detail')
        var brand_role = require('../../db/models/brand_role')
        var user = require('../../db/models/user')
        var user_role = require('../../db/models/user_role')
        var agent = require('../../db/models/agent')
        var agent_brand_role = require('../../db/models/agent_brand_role')

        employment.hasMany(employment_detail)
        agent.hasOne(agent_brand_role)
        agent_brand_role.belongsTo(brand_role)

        return Promise.all([
            //查找是否已提交过招募申请
            employment.findOne({
                where: {
                    brand_guid: employmentData.publishEmploymentInfo.brand_guid,
                    employee_user_account: data.account
                }
            }),
            //查找是否已注册过账号
            user.findOne({
                where: {
                    account: data.account
                }
            }),
            //查找品牌商account
            agent.findOne({
                include: [{
                    model: agent_brand_role,
                    include: [{
                        model: brand_role,
                        where: {
                            level: "0"
                        },
                    }],
                }]
            })

        ]).then(function(result) {
            if (result[2] == null) {
                return Promise.reject("找不到审核人的信息")
            } else if (result[0] != null || result[1] != null) {
                return Promise.reject("您已提交过申请或者已成为该品牌成员，提交申请失败")
            } else {
                var createList = []
                for (var item in meta) {
                    if (item != 'addressTemp') {
                        createList.push(
                            employment_detail.create({
                                employment_guid: guid,
                                key: item,
                                value: data[item],
                            })
                        )
                    }
                }

                var pwd = "";
                for (var i = 0; i < 8; i++) {
                    pwd += Math.floor(Math.random() * 10);
                }

                var audit_user_account = result[2].user_account

                return Promise.all([
                    user.create({ account: data.cellphone, password: pwd }),
                    user_role.create({ user_account: data.cellphone, role_code: 'test_role' })
                ]).then(function(result) {
                    if (result[0] == null || result[1] == null) {
                        return Promise.reject("创建您的成员账号失败")
                    } else {
                        return user.findOne({
                            where: {
                                account: data.cellphone
                            }
                        }).then(function(result) {
                            var pwdFromTable = result.password
                            return Promise.all([
                                employment.create({
                                    guid: guid,
                                    publish_employment_guid: employmentData.publishEmploymentInfo.guid,
                                    employer_user_account: employmentData.publishEmploymentInfo.employer_user_account,
                                    brand_role_code: employmentData.publishEmploymentInfo.brand_role_code,
                                    brand_guid: employmentData.publishEmploymentInfo.brand_guid,
                                    employee_user_account: data.cellphone,
                                    employer_time: employmentData.publishEmploymentInfo.create_time,
                                    audit_user_account: audit_user_account,
                                    deadline: deadline,
                                    status: "未审核"
                                }),
                                createList,
                            ]).then(function(result) {
                                var flag = true
                                for (var item in result) {
                                    flag = ((result[item] == null) ? false : true) || flag
                                }
                                if (flag == true) {
                                    req.session.pwd = pwdFromTable
                                } else {
                                    return Promise.reject("后台创建招募申请失败")
                                }
                            })
                        })
                    }
                })
            }
        })
    },
    getPwd(req, res, next) {
        return req.session.pwd
    },
    getPublishEmploymentInfo(req, res, next) {
        var employmentGuid = req.body.employmentGuid

        var publish_employment = require('../../db/models/publish_employment')

        return publish_employment.findOne({
            where: {
                guid: employmentGuid
            }
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("招募信息读取出错")
            } else if (result.status == false) {
                return Promise.reject("招募已关闭")
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